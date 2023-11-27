import React, {useEffect, useState} from 'react';
import {ResponsiveBar} from '@nivo/bar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const aggregateData = (data) => {
    return data.reduce((result, current) => {
        const existingEntry = result.find((entry) => entry.purchasedate === current.purchasedate);

        if (existingEntry) {
            existingEntry.price += parseFloat(current.price);
            return result;
        }

        result.push({ ...current, price: parseFloat(current.price) });
        return result;
    }, []);
};
const BarChart = () => {
    const [chartData, setChartData] = useState([]);

    let today = new Date(Date.now());

    let lastMonth = (today.getFullYear() + "-" + today.getMonth())

    const [monthOffset, setMonthOffset] = useState(lastMonth)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/statistics/${monthOffset}`);
                const data = await response.json();

                console.log('Fetched data:', data);

                const aggregatedData = aggregateData(data);
                setChartData(aggregatedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [monthOffset]);

    const handleMonthChange = (offset) => {
        const currentMonth = new Date(monthOffset + '-01');
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
        setMonthOffset(`${newMonth.getFullYear()}-${(newMonth.getMonth() + 1).toString().padStart(2, '0')}`);
    };
    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center', paddingLeft: '1rem'}}>
                <IconButton onClick={() => handleMonthChange(-1)}>
                    <ArrowBackIcon/>
                </IconButton>
                <span>{monthOffset}</span>
                <IconButton onClick={() => handleMonthChange(1)}>
                    <ArrowForwardIcon/>
                </IconButton>
            </div>

            <div style={{height: '400px'}}>
                <ResponsiveBar
                    data={chartData}
                    keys={['price', 'quantity']}
                    indexBy="purchasedate"
                    margin={{top: 50, right: 130, bottom: 50, left: 60}}
                    padding={0.3}
                    colors={{scheme: 'nivo'}}
                    enableLabel={false}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Purchase Date',
                        legendPosition: 'middle',
                        legendOffset: 32,
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Value',
                        legendPosition: 'middle',
                        legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{from: 'color', modifiers: [['darker', 1.6]]}}
                />
            </div>
        </div>
    );
};

export default BarChart;
