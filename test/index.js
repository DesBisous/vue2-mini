import Vue from 'vue-template-ast-compiler';

let vm = new Vue({
  el: '#app',
  data() {
    return {
      name: '晓滨',
      age: 34,
      info: {
        job: 'teacher',
        students: [
          {
            id: 1,
            name: '小张',
          },
          {
            id: 2,
            name: '小王',
          },
        ],
      },
      hobby: ['piano', 'travel', 'film'],
      jobStyle: {
        color: 'teal',
      },
    };
  },
});

setTimeout(function () {
  vm.info.students.push({
    id: 3,
    name: '小红',
  });
}, 2000);
