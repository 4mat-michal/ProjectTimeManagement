<template>
  <div class="container">
    <div class="d-inline-flex  justify-content-center timer-box">
      <form name="project_time" method="post" class="d-inline-flex">
        <div class="me-3"><input  id="project_name" name="project[name]" required="required"
                                 class="input-group-text form-control project-name-input "
                                 placeholder="project name"></div>
        <div class="time-hours" ref="hours">00:</div>
        <div class="time-minutes" ref="minutes">00:</div>
        <div class="time-seconds me-2" ref="seconds">00</div>
        <div class="d-inline-flex mb-2 btn-functions">
          <input style="display: none" name="project[projectReports][1][timeOfProject]" ref="time-of-project"
                 required="required">
          <div>
            <a class="btn  me-2 btn-start" @click="startTime" ref="start-button">Start</a>
          </div>
          <div>
            <a class="btn btn-dark me-2" type="submit" ref="pause-button" @click="pauseTime">Pause</a>
          </div>
          <div>
            <button  class="btn btn-dark me-2" name="project_time[save]" ref="stop-button" @click="stopTime"
                    type="submit">Stop
            </button>
          </div>
          <div>
            <a class="btn btn-dark me-2" @click="resetTime" ref="reset-button">Reset</a>
          </div>
        </div>
      </form>
    </div>
    <div class="list-group" ref="list-group" v-for="(projects,key) in projectsData">
      <div class="project-display">
        <input class="date-display" @change="editDate(projects.id)" v-bind:value="projects.date" />
        <div class="d-inline-flex project-content-box">
          <div class="list-group-item list-group-item-action">
            <a @click="showChildProjects(projects.name,projects.date, projects.id)"
               v-bind:class="'box-number numbers-of-doing-project-' + projects.id">{{
                counts[projects.name + ' ' + projects.date]
              }}</a>
            <input @change="editName(projects.name, projects.date, $event)"
                   v-bind:class="'project-name-input project-name-' + projects.name" v-bind:value="projects.name">
            <button class="toggle-button" ref="toggle-button">
              <div class="dropdown">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="26" fill="currentColor"
                     class="bi bi-list-nested dropdown-toggle" id="dropdownMenuButton1" viewBox="0 0 16 20"
                     data-bs-toggle="dropdown" aria-expanded="false">
                  <path fill-rule="evenodd"
                        d="M4.5 11.5A.5.5 0 0 1 5 11h10a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 1 3h10a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z"/>
                </svg>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li class="text-center "><a class="text-decoration-none delete-button"
                                              @click="deleteProject(projects.name, projects.date)">Delete</a></li>
                </ul>
              </div>
            </button>
            <div class="time-display">
              <p>{{ projectHours[key] }}:{{ projectMinutes[key] }}:{{ projectSeconds[key] }}</p>
            </div>
          </div>
        </div>
        <div
            v-bind:class="'list-group-item list-group-item-action child-data-project-' + projects.date + '-' + projects.id "
            ref="child-data-project" style="display: none">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  props: ['projectsTime'],
  data() {
    return {
      hours: '00',
      minutes: '00',
      seconds: '',
      timer: null,
      time: '00:00:00',
      projectsData: [],
      projectDate: '',
      todayDate: '',
      counts: {},
      projectSeconds: [],
      projectMinutes: [],
      projectHours: [],
    }
  },
  mounted() {
    this.$refs["pause-button"].style.display = 'none';
    this.$refs["stop-button"].style.display = 'none';
    this.$refs["reset-button"].style.display = 'none';
  },
  beforeMount() {
    let j = -1;
    let projectsName = [];

    this.projectsTime.forEach(project => {
      let lastCharInDate = project.createdAt.indexOf('T');
      let projectDate = project.createdAt.slice(0, lastCharInDate);
      this.counts[project.projectName.name + ' ' + projectDate] = (this.counts[project.projectName.name + ' ' + projectDate] || 0) + 1;
    });


    for (let i = this.projectsTime.length - 1; i >= 0; i--) {
      let lastCharInDate = this.projectsTime[i].createdAt.indexOf('T');
      let projectDate = this.projectsTime[i].createdAt.slice(0, lastCharInDate);

      this.todayDate = new Date().getUTCFullYear() + '-' + (new Date().getUTCMonth() + 1 < 10 ? '0' + (new Date().getUTCMonth() + 1) : new Date().getUTCMonth() + 1) + '-' + new Date().getUTCDate();

      if (typeof this.projectsData[j] == 'undefined' || this.projectsData[j].date !== projectDate || !projectsName.includes(this.projectsTime[i].projectName.name)) {
        let name = this.projectsTime[i].projectName.name
        this.projectsData.push({name: name, date: projectDate, id: this.projectsTime[i].id})
        projectsName.push(name);
        j++
        let projectsTime = this.projectsTime;
        let seconds = 0;
        let minutes = 0;
        let hours = 0;
        let projects = projectsTime.filter(name => name.projectName.name === projectsTime[i].projectName.name && name.createdAt.includes(projectDate));
        for (var project in projects) {
          let time = projects[project].timeOfProject[0].split(':')
          seconds += parseInt(time[2])
          minutes += parseInt(time[1])
          hours += parseInt(time[0])
          if (seconds > 59) {
            minutes++;
            seconds = seconds - 59
          }
          if (minutes > 59) {
            hours++
            minutes = minutes - 59
          }
        }

        this.projectSeconds.push(seconds < 10 ? '0' + seconds : seconds);
        this.projectMinutes.push(minutes < 10 ? '0' + minutes : minutes);
        this.projectHours.push(hours < 10 ? '0' + hours : hours);
      }
    }
  },
  methods: {
    startTime: function () {
      this.$refs["start-button"].style.display = 'none';
      this.$refs["pause-button"].style.display = 'inline-flex';
      this.$refs["stop-button"].style.display = 'inline-flex';
      this.$refs["reset-button"].style.display = 'inline-flex';
      let seconds = this.$refs.seconds
      let minutes = this.$refs.minutes
      let hours = this.$refs.hours

      if (this.timer == null) {
        this.timer = setInterval(() => {
          if (this.seconds === 60) {
            this.seconds = '0';
            this.minutes++
            this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
            minutes.innerHTML = this.minutes + ":";
          } else if (this.minutes === 60) {
            this.minutes = '00';
            this.hours++;
            this.hours = this.hours < 10 ? '0' + this.hours : this.hours;
            hours.innerHTML = this.hours + ":"
          }
          this.seconds++;
          this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
          this.time = this.hours + ":" + this.minutes + ":" + this.seconds;
          seconds.innerHTML = this.seconds;
        }, 1000)
      }
    },
    pauseTime: function () {
      clearInterval(this.timer);
      this.timer = null;
      this.$refs["start-button"].style.display = 'inline-flex';
    },
    stopTime: function () {
      //pass the time to the input
      console.log(this.time)
      this.$refs["time-of-project"].value = this.time
      clearInterval(this.timer);
      this.resetTime()
    },
    resetTime: function () {
      this.seconds = '00';
      this.minutes = '00';
      this.hours = '00';
      this.$refs.seconds.innerHTML = '00';
      this.$refs.minutes.innerHTML = '00:';
      this.$refs.hours.innerHTML = '00:';

    },
    showChildProjects: function (name, date, id) {
      let childProject = document.querySelector('.child-data-project-' + date + '-' + id)
      childProject.style.display = 'block';
      let show = childProject ? childProject.childElementCount > 0 : false
      let projects = this.projectsTime.filter(project => project.projectName.name === name && project.createdAt.includes(date));
      if (show === false) {
        for (var project in projects) {
          let element = document.createElement('div');
          let input = document.createElement('input');
          let button = document.createElement('button');

          element.className = 'child-project';
          input.className = 'child-project-time';
          element.innerHTML = projects[project].projectName.name
          button.innerText = 'Delete'
          input.value = projects[project].timeOfProject[0]
          input.dataset.id = projects[project].id
          button.dataset.id = projects[project].id
          input.addEventListener('change', this.editTime);
          button.addEventListener('click', this.deleteProject);
          element.appendChild(input)
          element.appendChild(button)
          childProject.appendChild(element)
        }
      } else {
        document.querySelectorAll('.child-project').forEach(project => {
          project.remove();
        })
        childProject.style.display = 'none';
      }
    },
    deleteProject: function (projectsName, projectDate) {
      axios.post('/app/project/delete', {
        projectName: projectsName,
        projectDate: projectDate,
        projectId: event.target.dataset.id
      }).then(response => console.log(response))
      window.location.reload();
    },
    editName: function (projectName, projectDate, event) {
      console.log(projectName);
      event.preventDefault();
      axios.post('/app/project/new', {projectName: projectName, projectDate: projectDate, newName: event.target.value})
    },
    editTime: function (event) {
      axios.post('/app/project/new', {projectId: event.target.dataset.id, newTime: event.target.value})
    },
    editDate: function (id){
      axios.post('/app/project/new', {id: id, newDate: event.target.value})
    }

  }
}
</script>