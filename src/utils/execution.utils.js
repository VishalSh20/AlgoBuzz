import axios from 'axios';

export default async function getExecutionResults(code, language, testcases = [{ input: "" }], memorylimit = 256, timelimit = 60) {
    try {
        const executionResults = [];
        let overallStatus = "ACCEPTED";
        let overallTime = 0;
        let overallMemory = 0;

        for (const testcase of testcases) {
            // Prepare submission for individual testcase
            const submission = {
                language,
                code,
                stdin: testcase.input,
                expectedOutput: testcase.output || null,
                memoryLimit: String(memorylimit),
                timeLimit: String(timelimit)
            };

            const submissionQueuingURL = `${process.env.NEXT_PUBLIC_EXECUTION_WORKER_URL}/submission`;
            console.log("Submitting testcase at", submissionQueuingURL);
            
            // Submit individual testcase
            const submissionQueuingResponse = await axios.post(
                submissionQueuingURL,
                submission
            );

            const submissionQueuingResponseData = submissionQueuingResponse.data;
            
            // Check if submission was successful
            if (!submissionQueuingResponseData.token) {
                throw new Error(submissionQueuingResponseData.error);
            }

            const token = submissionQueuingResponseData.token;
            console.log("Recieved token: ", token);
            
            // Poll for result of this specific submission
            const pollStartTime = Date.now();
            const pollDuration = 2 * 60 * 1000;
            let result = null;

            while (Date.now() - pollStartTime < pollDuration) {
                const resultUrl = `${process.env.NEXT_PUBLIC_EXECUTION_WORKER_URL}/submission?token=${token}`;
                const resultResponse = await axios.get(resultUrl);
                const resultResponseData = resultResponse.data?.[0];
                console.log("Result response data:", resultResponseData);

                if (resultResponseData.status !== "QUEUED" && resultResponseData.status !== "EXECUTING") {
                    result = resultResponseData;
                    break;
                }

                await new Promise(r => setTimeout(r, 1000));
            }

            if (!result) {
                throw new Error(`Polling timed out for token ${token}`);
            }

            // Accumulate results
            executionResults.push(result);

            // Update overall status
            if (result.status !== "ACCEPTED" && overallStatus === "ACCEPTED") {
                overallStatus = result.status;
            }

            // Update overall time and memory
            overallTime = Math.max(overallTime, result.time || 0);
            overallMemory = Math.max(overallMemory, result.memory || 0);
        }

        return {
            executionResults: executionResults,
            overallMemory,
            overallStatus,
            overallTime
        };

    } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.error || error.message;
        return { error: errorMessage };
    }
}