/* global $ Vue */
"use strict";

new Vue({
  el: '#app',
  data: {
    loaded: false,
    players: [],
    timer: 10,
    teamScores: [],
    teams: ['raptors', 'warriors']
  },
  methods: {
    getData: function getData() {
      var _this = this;

      this.loaded = false;
      this.timer = 10;
      var timerInterval = setInterval(function () {
        if (_this.timer < 2) {
          _this.timer -= _this.timer / 2;
        } else {
          _this.timer--;
        }
      }, 1000);
      // /data-test.json is a good test data kit
      $.get('/data.json', function (data) {
        clearInterval(timerInterval);
        var ordered = data.sort(function (a, b) {
          // in order of ascending score
          return b.score - a.score;
        });
        _this.players = ordered;
        _this.getTeamScores();
        _this.loaded = true;
        // Don't calculate height until after table is rendered
        setTimeout(function () {
          // So later refreshes don't look bad (scrollbar disappearing)
          var $body = $('body');
          $body.css('min-height', $body.height());
        }, 0);
      });
    },
    getTeamScore: function getTeamScore(team) {
      var score = this.players.reduce(function (prev, curr) {
        if (curr.team === team) {
          return prev + curr.score;
        } else {
          return prev;
        }
      }, 0);
      return score;
    },
    getTeamScores: function getTeamScores() {
      this.teamScores = [this.getTeamScore(0), this.getTeamScore(1)];
    }
  },
  ready: function ready() {
    this.getData();
  }
});

Vue.filter('twoDecimals', function (value) {
  return Math.round(value * 100) / 100;
});

Vue.filter('capitalize', function (value) {
  return value.substr(0, 1).toUpperCase() + value.substr(1);
});