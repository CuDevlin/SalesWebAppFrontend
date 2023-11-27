import {Box} from "@mui/material";



const TopBar = () => {

    return (
        <Box display="flex" alignItems={"center"} padding={1}  style={{ backgroundColor: 'lightgray' }}>
            <img src={"../../WA.png"} alt={"WhiteAway"} style={{height: "2rem", paddingLeft:"20px"}}/>
            <h2 style={{paddingLeft:"10px"}}>WhiteAway</h2>
        </Box>);
}

export default TopBar;