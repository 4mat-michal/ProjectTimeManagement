import Vue from "vue";
import Timer from './Timer';
import './styles/app.css';
import Chart from './chartSummary'


new Vue({
    el: '#app',
    render(h) {
        return h(Timer, {
            props: {
                projectsTime: JSON.parse(this.$el.attributes['data-projects-time'].value)
            }
        })
    }
});