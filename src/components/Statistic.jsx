import {useEffect, useState} from "react";
import { Box } from "@mui/material";

const Statistic = () =>
{
    const [chartData, setChartData] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/total/revenue');
                const data = await response.json();
                setChartData(data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Box display="flex" justifyContent="flex-end" sx={{paddingRight: '15%'}}>
            <h2>{chartData} DKK</h2>
        </Box>
    )

}
export default Statistic