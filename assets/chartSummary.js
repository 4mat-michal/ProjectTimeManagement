window.addEventListener('load', function () {


    var chart = document.getElementById('chart')
    var ctx = chart.getContext('2d')
    let projects = JSON.parse(chart.dataset.projects)


    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: '00:00:00',
                    type: 'time',
                    time: {
                        parser: 'HH:mm:ss',
                        unit: "hours",
                        tooltipFormat: 'HH:mm:ss',
                        displayFormats: {
                            'hours': "HH:mm:ss"
                        },
                    }
                }
            }
        }
    });
    let colours = Array(100)
    for (let projectKey in projects) {
        colours[projectKey] = Math.floor(Math.random() * 16777215).toString(16)
        let lastCharInDate = projects[projectKey].createdAt.indexOf('T');
        let projectDate = projects[projectKey].createdAt.slice(0, lastCharInDate);

        let data = {
            label: projects[projectKey].projectName.name,
            data: [],
            borderColor: "#16a085",
            backgroundColor: '#' + colours[projectKey],
        }
        if (!myChart.data.labels.includes(projectDate) && myChart.data.labels.length > 0) {
            myChart.data.labels.push(projectDate);
            data.data.push({x: projectDate, y: projects[projectKey].timeOfProject[0]});
            myChart.data.datasets.push(data);
        } else if (myChart.data.labels.length < 1) {
            myChart.data.labels.push(projectDate);
            data.data.push({x: projectDate, y: projects[projectKey].timeOfProject[0]});
            myChart.data.datasets.push(data);
        } else {
            data.data.push({x: projectDate, y: projects[projectKey].timeOfProject[0]});
            myChart.data.datasets.push(data);
        }
        myChart.update()
    }
})