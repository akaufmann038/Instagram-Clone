import { Card, CardHeader, CardActions, Button } from '@material-ui/core';

const Post = ({ content, deleteAction, id, userId }) => {
    return (
        <Card>
            <CardHeader title={content}/>
            <CardActions>
                <Button color="secondary" variant="contained" onClick={() => deleteAction(userId, id)} href="http://localhost:3000/">Delete</Button>
            </CardActions>
            <h4>ID: {id}</h4>
        </Card>
    )
}

export default Post