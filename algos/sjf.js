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
    var n = tuple.length;
    var artt = [];
    var total_btt = [];
    for (var i = 0; i < tuple.length; i++) {
      total_btt[i] = tuple[i].bt;
      artt[i] = tuple[i].art;
    }
    var tuple_temp = tuple;
    tuple.sort(function (a, b) {
      return a.art - b.art;
    });
    tuple.sort();
    var wt = [];
    var tat = [];
    var total_wt = 0;
    var total_tat = 0;
    var final_ans = [];
    var visited = [];
    for (var i = 0; i < tuple.length; i++) {
      visited[i] = 0;
    }

    var que = [];
    var btco = [];
    for (var i = 0; i < n; i++) {
      btco[i] = 0;
    }

    for (var i = 0; i < 10000; i++) {
      for (var j = 0; j < n; j++) {
        if (tuple[j].bt <= 0) {
          visited[j] = 1;
        }
      }
      var mn = 9999;
      var state = -1;
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i) {
          if (tuple[j].bt < mn && visited[j] === 0) {
            mn = tuple[j].bt;
            state = j;
          }
        }
      }
      if (state == -1) {
        final_ans.push("/");
        var smit = [];
        que.push(smit);
      } else {
        for (var j = 0; j < 1; j++) {
          final_ans.push(tuple[state].pid);
        }
        tuple[state].bt -= 1;
        for (var g = i; g < i + 1; g++) {
          var smit = [];
          for (var y = 0; y < n; y++) {
            if (tuple[y].art <= g || btco[y] == 1) {
              smit.push(tuple[y].pid);
            }
          }
          que.push(smit);
        }
      }
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
    console.log(que.length);
    for (var i = 0; i < n; i++) {
      tat[i] = cmp_time[i] - artt[i];

      wt[i] = tat[i] - total_btt[i];
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
    var n = tuple.length;
    var total_bt = [];
    var artt = [];
    var total_btt = [];
    for (var i = 0; i < tuple.length; i++) {
      total_bt[i] = tuple[i].bt1 + tuple[i].bt2;
      total_btt[i] = total_bt[i];
      artt[i] = tuple[i].art;
    }
    var tuple_temp = tuple;
    tuple.sort(function (a, b) {
      return a.art - b.art;
    });
    tuple.sort();
    var wt = [];
    var tat = [];
    var total_wt = 0;
    var total_tat = 0;
    var final_ans = [];
    var visited = [];
    for (var i = 0; i < tuple.length; i++) {
      visited[i] = 0;
    }
    var que = [];
    var btco = [];
    for (var i = 0; i < n; i++) {
      btco[i] = 0;
    }
    for (var i = 0; i < 10000; i++) {
      for (var j = 0; j < n; j++) {
        if (total_bt[i] <= 0) {
          visited[i] = 1;
        }
      }
      var mn = 10000;
      var state = -1;
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i) {
          if (total_bt[j] < mn) {
            mn = total_bt[j];
            state = j;
          }
        }
      }

      if (state == -1) {
        final_ans.push("/");
        var smit = [];
        que.push(smit);
      } else {
        if (btco[state] === 0) {
          for (var j = 0; j < 1; j++) {
            final_ans.push(tuple[state].pid);
          }
          tuple[state].bt1 -= 1;
          total_bt[state] -= 1;
          for (var g = i; g < i + 1; g++) {
            var smit = [];
            for (var y = 0; y < n; y++) {
              if (tuple[y].art <= g || btco[y] == 1) {
                smit.push(tuple[y].pid);
              }
            }
            que.push(smit);
          }
          if (tuple[state].bt1 <= 0) {
            tuple[state].art = i + tuple[state].io + 1;
            btco[state] = 1;
          }
        } else {
          for (var j = 0; j < 1; j++) {
            final_ans.push(tuple[state].pid);
          }
          tuple[state].bt2 -= 1;
          total_bt[state] -= 1;
          for (var g = i; g < i + 1; g++) {
            var smit = [];
            for (var y = 0; y < n; y++) {
              if (tuple[y].art <= g || btco[y] == 1) {
                smit.push(tuple[y].pid);
              }
            }
            que.push(smit);
          }
          if (tuple[state].bt2 <= 0) {
            tuple[state].art = 10000;
          }
        }
      }
    }
    console.log(que.length);
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
    for (var i = 0; i < n; i++) {
      tat[i] = cmp_time[i] - artt[i];

      wt[i] = tat[i] - total_btt[i];
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
module.exports = router;
