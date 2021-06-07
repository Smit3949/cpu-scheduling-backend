const router = require('express').Router();
router.post('/', (req, res) => {
    var state = req.body;
    var tuple = [],
    tuple_temp = [];
    var n = state.tableData.length;
    for (let i = 0; i < n; i++) {
      var tempPid = state.tableData[i][0].substring(1);
      tempPid = parseInt(tempPid) + 1;
      tuple.push({
        pid: tempPid,
        bt: parseInt(state.tableData[i][2]),
        art: parseInt(state.tableData[i][1]),
      });
      tuple_temp.push({
        pid: tempPid,
        bt: parseInt(state.tableData[i][2]),
        art: parseInt(state.tableData[i][1]),
      });
    }
    var tq = state.time_Quantam;
    var n = tuple.length;
    var wt = []; // waiting time
    var tat = []; // turnaround time
    var total_wt = 0; //total waiting time
    var total_tat = 0; //total turnaround time
    var final_ans = []; // grannt chart
    var vis = [];
    for (var i = 0; i < tuple.length; i++) {
      vis[i] = 0;
    }
    var rt = [];
    for (var i = 0; i < n; i++) {
      rt.push(tuple[i].bt);
    }
    var store = [];
    var visited = [];
    for (var i = 0; i < n; i++) {
      visited[i] = 0;
    }
    var que = []; //READY QUEUE
    var fl = 0;
    var val = 0;
    var count = 0;
    for (var i = 0; i < 10000; i++) {
      count++;
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i && vis[j] != 1) {
          store.push(j);
          vis[j] = 1;
        }
      }
      if (fl == 1 && tuple[val].bt > 0) {
        store.push(val);
      }
      if (store.length === 0) {
        var smit = [];
        for (var h = 0; h < n; h++) {
          if (tuple[h].art <= i && visited[h] === 0) {
            smit.push(tuple[h].pid);
          }
        }
        que.push(smit);
        final_ans.push("/");
      } else {
        fl = 1;
        for (var j = i; j < i + tq; j++) {
          var smit = [];
          for (var h = 0; h < n; h++) {
            if (tuple[h].art <= j && visited[h] === 0) {
              smit.push(tuple[h].pid);
            }
          }
          que.push(smit);
        }
        val = store[0];
        store.shift();
        var brt = tuple[val].bt;
        for (var t = 0; t < Math.min(brt, tq); t++) {
          final_ans.push(tuple[val].pid);
        }
        tuple[val].bt -= tq;
        if (tuple[val].bt <= 0) {
          visited[val] = 1;
        }
        i += Math.min(brt, tq) - 1;
      }
    }
    for (var i = 0; i < 50; i++) {
      console.log(final_ans[i]);
    }
    var cmp_time = []; //completion time
    for (var i = 0; i < tuple.length; i++) {
      cmp_time[i] = -1;
    }
    for (var i = final_ans.length - 1; i >= 0; i--) {
      if (final_ans[i] === "/") {
      } else {
        if (cmp_time[final_ans[i] - 1] == -1) {
          cmp_time[final_ans[i] - 1] = i + 1;
        }
      }
    }
    for (var i = 0; i < n; i++) {
      tat[i] = cmp_time[i] - tuple[i].art;
      wt[i] = tat[i] - rt[i];
    }
    for (var i = 0; i < n; i++) {
      total_wt = total_wt + wt[i];
      total_tat = total_tat + tat[i];
    }
    // Changing Pid into string in final answer array
    for (var i = 0; i < final_ans.length; i++) {
      if (final_ans[i] != "/") {
        final_ans[i]--;
        final_ans[i] = "P" + final_ans[i].toString();
      }
    }
    // Removing '/' from the back of the array
    for (var i = final_ans.length - 1; i >= 0; i--) {
      if (final_ans[i] != "/") break;
      final_ans.pop();
    }
    var data = {
        readyQue: que,
        tatarr: tat,
        wtarr: wt,
        comparr: cmp_time,
        avgtat: total_tat/n,
        avgwaiting: total_wt/n,
        ganntChartArray: final_ans
    }
    res.send(data);
});
router.post('/io', (req, res) => {
    var state = req.body;
    var tuple = [];
    var n = state.tableData.length;
    console.log(state.tableData);
    for (let i = 0; i < n; i++) {
      var tempPid = state.tableData[i][0].substring(1);
      tempPid = parseInt(tempPid) + 1;
      tuple.push({
        pid: tempPid,
        bt1: parseInt(state.tableData[i][2]),
        art: parseInt(state.tableData[i][1]),
        io: parseInt(state.tableData[i][3]),
        bt2: parseInt(state.tableData[i][4]),
      });
    }
    console.log(tuple);
    var n = tuple.length;
    var total_bt = [];
    var artt = [];
    var total_btt = [];
    for (var i = 0; i < tuple.length; i++) {
      total_bt[i] = tuple[i].bt1 + tuple[i].io + tuple[i].bt2;
      total_btt[i] = total_bt[i] - tuple[i].io;
      artt[i] = tuple[i].art;
    }
    var tuple_temp = tuple;
    tuple.sort(function (a, b) {
      return a.art - b.art;
    });
    tuple.sort();
    var wt = []; //waiting time
    var tat = []; //turnaround time
    var total_wt = 0; //total waiting time
    var total_tat = 0; //total turnaround time
    var final_ans = [];
    var visited = [];
    var main_que = [];
    for (var i = 0; i < tuple.length; i++) {
      visited[i] = 0;
    }
    var tq = state.time_Quantam;
    var que = [];
    var btco = [];
    for (var i = 0; i < n; i++) {
      btco[i] = 0;
    }
    var last = 10001;
    for (var i = 0; i < 10000; i++) {
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i && visited[j] === 0) {
          var flag = 0;
          for (var g = 0; g < main_que.length; g++) {
            if (main_que[g] == j) {
              flag = 1;
            }
          }
          if (flag === 0) main_que.push(j);
        }
      }
      if (last != 10001) {
        main_que.push(last);
      }
      var state = -1;
      if (main_que.length !== 0) {
        state = main_que[0];
        visited[state] = 1;
      }
      main_que.shift();
      if (state == -1) {
        final_ans.push("/");
        var smit = [];
        que.push(smit);
      } else {
        if (btco[state] === 0) {
          var to = Math.min(tuple[state].bt1, tq);
          for (var j = 0; j < to; j++) {
            final_ans.push(tuple[state].pid);
          }
          last = state;
          tuple[state].bt1 -= to;
          if (tuple[state].bt1 === 0) {
            btco[state] = 1;
            last = 10001;
            tuple[state].art = i + to + tuple[state].io;
            visited[state] = 0;
          }
          for (var j = i; j < i + to; j++) {
            var smit = [];
            for (var g = 0; g < n; g++) {
              if (tuple[g].art <= j) {
                smit.push(tuple[g].pid);
              }
            }
            que.push(smit);
          }
          i += to - 1;
        } else {
          var to = Math.min(tuple[state].bt2, tq);
          for (var j = 0; j < to; j++) {
            final_ans.push(tuple[state].pid);
          }
          last = state;
          tuple[state].bt2 -= to;
          if (tuple[state].bt2 === 0) {
            btco[state] = 1;
            last = 10001;
            tuple[state].art = 10001;
            visited[state] = 1;
          }
          for (var j = i; j < i + to; j++) {
            var smit = [];
            for (var g = 0; g < n; g++) {
              if (tuple[g].art <= j) {
                smit.push(tuple[g].pid);
              }
            }
            que.push(smit);
          }

          i += to - 1;
        }
      }
    }
    console.log(que.length);
    for (var i = 0; i < 50; i++) {
      console.log(i + " " + final_ans[i]);
    }
    var cmp_time = [];
    for (var i = 0; i < tuple.length; i++) {
      cmp_time[i] = -1;
    }
    for (var i = final_ans.length - 1; i >= 0; i--) {
      if (final_ans[i] === "/") {
      } else {
        if (cmp_time[final_ans[i] - 1] == -1) {
          cmp_time[final_ans[i] - 1] = i + 1;
        }
      }
    }

    var wt = [];

    for (var i = 0; i < n; i++) {
      tat[i] = cmp_time[i] - artt[i];
      wt[i] = tat[i] - total_btt[i];
    }
    for (var i = 0; i < n; i++) {
      total_wt = total_wt + wt[i];
      total_tat = total_tat + tat[i];
    }
    console.log(total_wt / n + " " + total_tat / n);
    // Changing Pid into string in final answer array
    for (var i = 0; i < final_ans.length; i++) {
      if (final_ans[i] != "/") {
        final_ans[i]--;
        final_ans[i] = "P" + final_ans[i].toString();
      }
    }
    // Removing '/' from the back of the array
    for (var i = final_ans.length - 1; i >= 0; i--) {
      if (final_ans[i] != "/") break;
      final_ans.pop();
    }
    var data = {
        readyQue: que,
        tatarr: tat,
        wtarr: wt,
        comparr: cmp_time,
        avgtat: total_tat/n,
        avgwaiting: total_wt/n,
        ganntChartArray: final_ans
    }
    res.send(data);
});
module.exports = router;
