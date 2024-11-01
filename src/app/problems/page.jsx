"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, Button, TextInput } from "flowbite-react";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import Loading from "../loading";

function Page() {
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [areProblemsAhead, setAreProblemsAhead] = useState(false);
  const [errorCode, setErrorCode] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErrorCode(0);
    setErrorMessage(null);

    axios
      .get("/api/topics/")
      .then((response) => {
        const data = response.data;
        if (data?.topics) {
          setTopics((topics) => data.topics);
        } else {
          setError(data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setLoading((loading) => true);
    const topicQuery = selectedTopics.map((topic) => `topics=${encodeURIComponent(topic)}`).join("&");
    const difficultyQuery = selectedDifficulties.map((diff) => `difficulties=${encodeURIComponent(diff)}`).join("&");
    const searchQuery = query ? `query=${encodeURIComponent(query)}` : "";
    let finalQuery = [topicQuery, difficultyQuery, searchQuery].filter((q) => q !== "").join("&");
    finalQuery = finalQuery ? `?${finalQuery}` : "";

    axios
      .get(`/api/problem/${finalQuery}`)
      .then((response) => {
        const data = response.data;
        if (data?.problems) {
          setProblems(() => data.problems);
          setAreProblemsAhead(() => data.areProblemsAhead);
        } else {
          setError(data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading((loading) => false);
      });
  }, [query, selectedTopics, selectedDifficulties]);

  const handleToggleDifficulty = (diff) => {
    const diffIncluded = selectedDifficulties.includes(diff);
    if (diffIncluded) {
      setSelectedDifficulties((difficulties) => difficulties.filter((difficulty) => difficulty !== diff));
    } else {
      setSelectedDifficulties((difficulties) => [...difficulties, diff]);
    }
  };

  const handleToggleTopic = (t) => {
    const topicIncluded = selectedTopics.includes(t);
    if (topicIncluded) {
      setSelectedTopics((selectedTopics) => selectedTopics.filter((topic) => topic !== t));
    } else {
      setSelectedTopics((selectedTopics) => [...selectedTopics, t]);
    }
  };

  return (
    <div className="bg-gradient pt-28 pb-12 min-h-screen">
      <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#6666662e_1px,transparent_1px),linear-gradient(to_bottom,#6666662e_1px,transparent_1px)] bg-[size:14px_24px] mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#ffffff_100%,transparent_100%)]">
      </div>
      {loading ? (
        // <div className="flex justify-center items-center h-full w-full">
        //   <Spinner color="purple" className="w-20 h-20" />
        // </div>
        <Loading />
      ) : (
        <div className="flex flex-col items-center w-full p-4 ">
          <div className="flex flex-wrap w-[90%] md:w-min-[70%] items-center justify-between gap-2 md:gap-6 p-4 rounded-2xl shadow-lg bg-gray-800/70 backdrop-blur-lg border border-gray-400 text-white relative z-20">

            {/* Search Bar */}
            <div className="flex items-center gap-4 py-2 px-2 w-full md:w-[50%] rounded-lg bg-gray-700 shadow-md mt-4 sm:mt-0">
              {/* <span className="font-serif text-lg hidden md:inline-block">Search:</span> */}
              <input
                className="rounded-lg py-2 px-4 bg-gray-600 text-white w-[90%] md:[85%] placeholder:text-gray-200"
                placeholder="Search problems"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="button-gradient1 rounded-full p-2.5"
                onClick={(e) => setQuery(searchQuery)}
              >
                <FaSearch />
              </button>
            </div>

            <div className=" flex gap-4">
              {/* Difficulty Section */}
              <div className="flex items-center gap-4 py-2 px-4 rounded-lg w-full md:w-fit bg-gray-700 shadow-md">
                <span className="font-serif text-lg">Difficulty:</span>
                <Dropdown
                  label={
                    <span className="font-semibold">
                      {selectedDifficulties.length === 0 || selectedDifficulties.length === 3
                        ? "All"
                        : selectedDifficulties.join(" and ")}
                    </span>
                  }
                >
                  <Dropdown.Header>
                    {selectedDifficulties.length ? (
                      <button
                        className="p-2 rounded-lg w-full border-2 border-purple-300"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedDifficulties(() => []);
                        }}
                      >
                        Unselect all
                      </button>
                    ) : (
                      <></>
                    )}
                  </Dropdown.Header>
                  <Dropdown.Item as="div" className="flex flex-col gap-2">
                    {["EASY", "MEDIUM", "HARD"].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => handleToggleDifficulty(diff)}
                        className={`transition-colors m-1 p-2 rounded-xl w-full text-left ${!selectedDifficulties.includes(diff)
                          ? "bg-gray-300 hover:bg-gray-400"
                          : "bg-purple-300 border-dotted border-2 border-gray-300 hover:bg-purple-400"
                          }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </Dropdown.Item>
                </Dropdown>
              </div>

              {/* Topics Section */}
              <div className="flex items-center gap-4 py-2 px-4 rounded-lg w-full md:w-fit bg-gray-700 shadow-md mt-4 sm:mt-0 ">
                <span className="font-serif text-lg">Topics:</span>
                <Dropdown
                  label={<span className="font-semibold">{selectedTopics.length ? `${selectedTopics.length} selected` : ""}</span>}
                >
                  <Dropdown.Header>
                    <div className="flex flex-col gap-2 p-2">
                      {selectedTopics.length ? (
                        <button
                          className="p-2 rounded-lg border-2 border-purple-300"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTopics(() => []);
                          }}
                        >
                          Unselect all
                        </button>
                      ) : (
                        <></>
                      )}
                      <span className="font-semibold">Selected Topics: {selectedTopics.join(", ")}</span>
                    </div>
                  </Dropdown.Header>
                  <Dropdown.Item as="div">
                    <div className="flex flex-wrap gap-2 mt-2 w-full">
                      {topics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => handleToggleTopic(topic)}
                          className={`transition-colors m-1 p-2 rounded-xl w-full sm:w-auto text-left ${!selectedTopics.includes(topic)
                            ? "bg-gray-300 hover:bg-gray-400"
                            : "bg-purple-300 border-dotted border-2 border-gray-300 hover:bg-purple-400"
                            }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </Dropdown.Item>
                </Dropdown>
              </div>
            </div>


          </div>

          {/* Problems Section */}
          <div className="grid grid-cols-2 max-md:grid-cols-1 w-full px-16 my-12 gap-4 relative">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="flex gap-6 justify-between items-center p-4 m-2 bg-gray-800/70 backdrop-blur-lg border border-gray-500 text-white rounded-lg"
              >
                <div className="text-lg font-semibold ">
                  {problem.id}. {problem.title}
                </div>
                <div
                  className={`text-sm font-semibold flex items-center gap-4 ${problem.difficulty === "EASY"
                    ? "text-green-400"
                    : problem.difficulty === "MEDIUM"
                      ? "text-yellow-400"
                      : "text-red-600"
                    }`}
                >
                  {problem.difficulty}
                  <Link href={`problem/${problem.slug}`}>
                    <button className=" button-gradient2">
                      Solve
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Page Navigation */}
          <div className="flex w-full justify-around">
            <Button color="info"
              outline
              disabled={page == 1}
              onClick={() => setPage(page => page - 1)}
            >
              <span className={`flex gap-1 items-center`}>
                <FaArrowLeft />Prev
              </span>
            </Button>
            <Button
              color="info"
              outline
              disabled={!areProblemsAhead}
              onClick={() => setPage(page => page + 1)}
            >
              <span className={`flex gap-1 items-center`}>
                Next<FaArrowRight />
              </span>
            </Button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Page;
