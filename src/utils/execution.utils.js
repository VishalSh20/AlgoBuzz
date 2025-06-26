import axios from 'axios';

export default async function getExecutionResults(
    code,
    language,
    testcases = [{ input: "" }],
    memorylimit = 256,
    timelimit = 60
) {
    try {
        // Helper function to poll individual token result
        const pollTokenResult = async (token) => {
            const pollStartTime = Date.now();
            const pollDuration = 2 * 60 * 1000; // 2 minutes

            while (Date.now() - pollStartTime < pollDuration) {
                const resultUrl = `${process.env.NEXT_PUBLIC_EXECUTION_WORKER_URL}/submission?token=${token}`;
                const resultResponse = await axios.get(resultUrl,{withCredentials:true});
                const resultResponseData = resultResponse.data?.[0];

                if (
                    resultResponseData.status !== "QUEUED" &&
                    resultResponseData.status !== "EXECUTING"
                ) {
                    return resultResponseData;
                }

                await new Promise((r) => setTimeout(r, 1000));
            }
            throw new Error(`Polling timed out for token ${token}`);
        };

        // Submit all test cases concurrently
        const submissionPromises = testcases.map((testcase) => {
            const submission = {
                language,
                code,
                stdin: testcase.input,
                expectedOutput: testcase.output || null,
                memoryLimit: String(memorylimit),
                timeLimit: String(timelimit),
            };

            const submissionQueuingURL = `${process.env.NEXT_PUBLIC_EXECUTION_WORKER_URL}/submission`;

            return axios.post(submissionQueuingURL, submission);
        });

        const submissionResponses = await Promise.all(submissionPromises);

        // Extract tokens from submissions
        const tokens = submissionResponses.map((response) => {
            if (!response.data.token) {
                throw new Error(response.data.error || "No token received");
            }
            return response.data.token;
        });

        // Poll all tokens concurrently
        const pollingPromises = tokens.map(pollTokenResult);
        const executionResults = await Promise.all(pollingPromises);

        // Calculate overall metrics
        let overallStatus = "ACCEPTED";
        let overallTime = 0;
        let overallMemory = 0;

        for (const result of executionResults) {
            if (result.status !== "ACCEPTED" && overallStatus === "ACCEPTED") {
                overallStatus = result.status;
            }
            overallTime = Math.max(overallTime, result.time_taken || 0);
            overallMemory = Math.max(overallMemory, result.memory_used || 0);
        }

        return {
            executionResults,
            overallMemory,
            overallStatus,
            overallTime,
        };
    } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || error.message;
        return { error: errorMessage };
    }
}