import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {Pagination} from 'antd';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const labels = [
    'Tháng 01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
];
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'Biểu đồ thống kê thu nhập năm 2023',
        },
    },
    elements: {
        line: {
            borderWidth: 2,
            tension: 0,
        },
    },
    scales: {
        x: {
            grid: {
                display: true,
            },
        },
        y: {
            grid: {
                display: true,
            },
        },
    },
};

export function Income(props) {
    const [income, setIncome] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7;

    useEffect(() => {
        axios
            .get(`http://localhost:8080/homes/users/${props.user.id}/income`)
            .then((response) => {
                setIncome(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const generateDataArray = (income, name) => {
        const dataArray = new Array(12).fill(null);
        income.forEach((item) => {
            if (item.name === name) {
                const monthIndex = new Date(item.month).getMonth();
                dataArray[monthIndex] = item.income;
            }
        });
        return dataArray;
    };

    const names = [...new Set(income.map((item) => item.name))];
    const totalItems = income.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    const colorPalette = [
        '#d90a0a',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
    ];

    const chartData = {
        labels: labels,
        datasets: names.map((name, index) => ({
            label: name,
            data: generateDataArray(income, name),
            borderColor: colorPalette[index % colorPalette.length],
            backgroundColor: 'rgba(0,0,0,0)',
            spanGaps: true,
        })),
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [nameFilter, setNameFilter] = useState("");
    const [monthFilter, setMonthFilter] = useState("");

    const handleNameFilter = (event) => {
        const name = event.target.value;
        setNameFilter(name);
        setCurrentPage(1);
    };

    const handleMonthFilter = (event) => {
        const month = event.target.value;
        setMonthFilter(month);
        setCurrentPage(1);
    };

    const filteredIncome = nameFilter || monthFilter
        ? income.filter((item) => {
            const nameMatch = nameFilter ? item.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
            const monthMatch = monthFilter ? item.month.substring(5, 7) === monthFilter : true;
            return nameMatch && monthMatch;
        })
        : [...income];


    const paginatedFilteredIncome = filteredIncome.slice(startIndex, endIndex);

    let totalIncome = 0;
    income.forEach((item) => {
        totalIncome += item.income;
    });

    return (
        <div className="container">
            <div className="chart-container">
                <Line options={options} data={chartData}/>
            </div>
            <div style={{color: 'red', fontSize: 13, textAlign: "center"}}>
                Chú thích: Chọn ô có màu tương ứng để ẩn đi biến động thu nhập của
                của từng homestay
            </div>
            <table className="table mt-3" style={{borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                <tr>
                    <th scope="col" style={{
                        borderBottom: '1px solid #000',
                        padding: '8px',
                        textAlign: 'center',
                        backgroundColor: "#36A2EB"
                    }}>
                        Tên Homestay
                    </th>
                    <th scope="col" style={{
                        borderBottom: '1px solid #000',
                        padding: '8px',
                        textAlign: 'center',
                        backgroundColor: "#36A2EB"
                    }}>
                        Tháng
                    </th>
                    <th scope="col" style={{
                        borderBottom: '1px solid #000',
                        padding: '8px',
                        textAlign: 'center',
                        backgroundColor: "#36A2EB"
                    }}>Tổng thu nhập
                    </th>
                </tr>
                <tr>
                    <th style={{display: 'flex', justifyContent: 'center'}}>
                        <input
                            placeholder="Lọc theo tên"
                            style={{width: 200, height: 30, textAlign: 'center',border:'1px solid black'}}
                            type="text"
                            onChange={handleNameFilter}
                        />
                    </th>
                    <th style={{justifyContent: 'center'}}>
                        <select
                            style={{width: 130, height: 30, textAlign: 'center', marginLeft: 40,marginBottom:6}}
                            onChange={handleMonthFilter}
                        >
                            <option value="">Lọc theo tháng</option>
                            <option value="01">Tháng 1</option>
                            <option value="02">Tháng 2</option>
                            <option value="03">Tháng 3</option>
                            <option value="04">Tháng 4</option>
                            <option value="05">Tháng 5</option>
                            <option value="06">Tháng 6</option>
                            <option value="07">Tháng 7</option>
                            <option value="08">Tháng 8</option>
                            <option value="09">Tháng 9</option>
                            <option value="10">Tháng 10</option>
                            <option value="11">Tháng 11</option>
                            <option value="12">Tháng 12</option>
                        </select>
                    </th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {paginatedFilteredIncome.map((item, index) => (
                    <tr key={index}>
                        <td style={{padding: '8px', textAlign: 'center'}}>{item.name}</td>
                        <td style={{padding: '8px', textAlign: 'center'}}>{item.month}</td>
                        <td style={{padding: '8px', textAlign: 'center'}}>
                            {item.income >= 1000000 ? item.income.toLocaleString() : item.income} VNĐ
                        </td>
                    </tr>
                ))}
                <tr>
                    <td style={{padding: '8px', textAlign: 'left', fontWeight: 'bold'}}>Tổng tất cả thu nhập:</td>
                    <td style={{padding: '8px', textAlign: 'center'}}></td>
                    <td style={{padding: '8px', textAlign: 'center', fontWeight: 'bold'}}>
                        {totalIncome >= 1000000 ? totalIncome.toLocaleString() : totalIncome} VNĐ
                    </td>
                </tr>
                </tbody>
            </table>
            <Pagination
                current={currentPage}
                total={filteredIncome.length}
                pageSize={pageSize}
                onChange={handlePageChange}
            />
        </div>
    );
}

export default Income;