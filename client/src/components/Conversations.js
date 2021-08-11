import { Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Conversations = ({ }) => {
    let history = useHistory()
    const [myMessages, setMyMessages] = useState([])
    const [otherMessages, setOtherMessages] = useState([])
    

    // left off here. was about to finish conversations page
    return (
        <div>
            <Button 
            onClick={() => history.push("/home")}
            color="secondary"
            variant="contained">Back</Button>
        </div>
    )
}

export default Conversations