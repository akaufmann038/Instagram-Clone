import { useEffect } from "react"

const TestComponent = ({ changeTestState, testState }) => {
    useEffect(() => {
        console.log("test effect")
    }, [])

    return (
        <div>
            <h3>Test State: {testState ? "true" : "false"}</h3>
            <button onClick={() => changeTestState()}>Change Test State</button>
        </div>
    )
}

export default TestComponent