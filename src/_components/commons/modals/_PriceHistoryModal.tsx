import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import css from '@/pages/CollectionsDetail/components/Buttons.module.scss';
import Chart from 'react-apexcharts';

const PriceHistory = ({ priceHistory }) => {
    const average = priceHistory?.map((item) => [new Date(item.dateAt).getTime(), +item.average_price]);
    const soldCount = priceHistory?.map((item) => [new Date(item.dateAt).getTime(), +item.sold_count]);

    const [chartState, setChartState]: any = useState({
        options: {
            chart: {
                id: 'area-datetime',
                type: 'area',
                zoom: {
                    autoScaleYaxis: true,
                },
                toolbar: {
                    show: true,
                },
            },
            grid: {
                show: true,
                borderColor: '#555555',
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                    bgColor: '#fff',
                    backgroundColor: '#fff',
                    columnRuleColor: '#fff',
                },
            },
            stroke: {
                curve: 'smooth',
                width: [2, 2, 2],
                colors: ['#ffb032'],
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                type: 'datetime',
                min: Date.now() - 3600 * 24 * 7 * 1000,
                max: Date.now(),
                tickAmount: 6,
                labels: {
                    show: true,
                    rotate: -45,
                    style: {
                        colors: [
                            '#ffb032',
                            '#ffb032',
                            '#ffb032',
                            '#ffb032',
                            '#ffb032',
                            '#ffb032',
                            '#ffb032',
                            '#ffb032',
                            '#ffb032',
                            '#ffb032',
                            '#ffb032',
                        ],
                    },
                },
            },
            tooltip: {
                fillSeriesColor: false,
                x: {
                    show: true,
                    format: 'dd MMM yyyy',
                },
                y: {
                    show: true,
                },
                theme: 'dark',
            },
            markers: {
                size: 5,
                strokeWidth: 1,
                fillOpacity: 0,
                strokeOpacity: 0,
                hover: {
                    size: 12,
                },
            },
            yaxis: [
                {
                    seriesName: 'sold count',
                    max: (max) => Math.floor(max * 1.5),
                    opposite: true,

                    // axisTicks: {
                    //     show: true,
                    // },

                    // axisBorder: {
                    //     show: true,
                    //     color: '#ffb032',
                    // },
                    labels: {
                        style: {
                            colors: '#ffb032',
                        },
                    },
                    title: {
                        text: 'sold count (daily sales)',
                        style: {
                            color: '#ffb032',
                        },
                    },
                },
                {
                    seriesName: 'average price',
                    max: (max) => Math.floor(max * 1.2),

                    // axisTicks: {
                    //     show: true,
                    // },
                    // axisBorder: {
                    //     show: true,
                    //     color: '#ffb032',
                    // },
                    labels: {
                        style: {
                            colors: '#f35f36',
                        },
                    },
                    title: {
                        text: 'average price (daily sales)',
                        style: {
                            color: '#f35f36',
                        },
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
            ],
            legend: {
                labels: {
                    colors: ['#f35f36', '#ffb032'],
                },
            },
            selection: 'one_week',
        },
        series: [
            {
                name: 'sold count',
                type: 'column',
                data: soldCount,
                color: '#ffb032',
            },
            {
                name: 'average price',
                type: 'line',
                data: average,
                color: '#f35f36',
            },
        ],
    });
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const updateData = (timeline) => {
        const newDate = Date.now();
        const oneMonth = 3600 * 24 * 30 * 1000;

        switch (timeline) {
            case 'one_week':
                setChartState({
                    ...chartState,
                    options: {
                        ...chartState.options,
                        selection: timeline,
                        xaxis: {
                            ...chartState.options.xaxis,
                            min: newDate - 3600 * 24 * 7 * 1000,
                            max: newDate,
                        },
                    },
                });
                break;
            case 'one_month':
                setChartState({
                    ...chartState,
                    options: {
                        ...chartState.options,
                        selection: timeline,
                        xaxis: {
                            ...chartState.options.xaxis,
                            min: newDate - oneMonth,
                            max: newDate,
                        },
                    },
                });
                break;
            case 'six_months':
                setChartState({
                    ...chartState,
                    options: {
                        ...chartState.options,
                        selection: timeline,
                        xaxis: {
                            ...chartState.options.xaxis,
                            min: newDate - oneMonth * 6,
                            max: newDate,
                        },
                    },
                });
                break;
            case 'one_year':
                setChartState({
                    ...chartState,
                    options: {
                        ...chartState.options,
                        selection: timeline,
                        xaxis: {
                            ...chartState.options.xaxis,
                            min: newDate - oneMonth * 12,
                            max: newDate,
                        },
                    },
                });
                break;
            case 'all':
                setChartState({
                    ...chartState,
                    options: {
                        ...chartState.options,
                        selection: timeline,
                        xaxis: {
                            ...chartState.options.xaxis,
                            min: new Date('23 Jan 2012').getTime(),
                            max: newDate,
                        },
                    },
                });
                break;
            default:
                break;
        }
    };

    const handleWindowResize = useCallback(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [handleWindowResize]);

    return (
        <div id="chart">
            <div className={cx('toolbar', css.chatUpdateButtonContainer)}>
                <button
                    id="one_week"
                    onClick={() => updateData('one_week')}
                    className={chartState.options.selection === 'one_week' ? 'active' : ''}
                >
                    7D
                </button>
                <button
                    id="one_month"
                    onClick={() => updateData('one_month')}
                    className={chartState.options.selection === 'one_month' ? 'active' : ''}
                >
                    1M
                </button>
                <button
                    id="six_months"
                    onClick={() => updateData('six_months')}
                    className={chartState.options.selection === 'six_months' ? 'active' : ''}
                >
                    6M
                </button>
                <button
                    id="one_year"
                    onClick={() => updateData('one_year')}
                    className={chartState.options.selection === 'one_year' ? 'active' : ''}
                >
                    1Y
                </button>
            </div>

            <div id="chart-timeline">
                <Chart
                    options={chartState.options}
                    series={chartState.series}
                    type="line"
                    width={windowSize.width - 200 > 800 ? 800 : windowSize.width - 200}
                    height={windowSize.height - 600}
                />
            </div>
        </div>
    );
};

export default PriceHistory;
