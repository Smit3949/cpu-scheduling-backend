const router = require('express').Router();
router.post('/',(req, res)=>{
    console.log(req.body);
    var state = req.body.state;
    console.log(state);
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
    var total_bt = []; // total burst time
    var artt = []; // temp. arrival time
    var total_btt = []; // total burst time without io
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
    var wt = []; //wating time
    var tat = []; //turnaround time
    var total_wt = 0; // total wating time
    var total_tat = 0; // total turnaround time
    var final_ans = []; // grannt chart
    var visited = [];
    for (var i = 0; i < tuple.length; i++) {
      visited[i] = 0;
    }
    var que = []; // ready queue
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
      var mn = 9999;
      var state = -1;
      for (var j = 0; j < n; j++) {
        if (tuple[j].art <= i) {
          if (tuple[j].art < mn) {
            mn = tuple[j].art;
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
          for (var j = 0; j < tuple[state].bt1; j++) {
            final_ans.push(tuple[state].pid);
          }
          tuple[state].art = i + tuple[state].bt1 + tuple[state].io; // change arrival time
          for (var g = i; g < i + tuple[state].bt1 - 1; g++) {
            var smit = [];
            for (var y = 0; y < n; y++) {
              if (tuple[y].art <= g || btco[y] == 1) {
                smit.push(tuple[y].pid);
              }
            }
            que.push(smit);
          }
          i += tuple[state].bt1 - 1;
          btco[state] = 1;
          total_bt[state] -= tuple[state].bt1 + tuple[state].io;
        } else {
          for (var j = 0; j < tuple[state].bt2; j++) {
            final_ans.push(tuple[state].pid);
          }
          for (var g = i; g < i + tuple[state].bt1 - 1; g++) {
            var smit = [];
            for (var y = 0; y < n; y++) {
              if (tuple[y].art <= g || btco[y] == 1) {
                smit.push(tuple[y].pid);
              }
            }
            que.push(smit);
          }
          i += tuple[state].bt2 - 1;
          total_bt[state] = 0;
          tuple[state].art = 100000;
        }
      }
    }
    var cmp_time = []; //COMPLETION TIME
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
    for (var i = 0; i < final_ans.length; i++) {
      if (final_ans[i] != "/") {
        final_ans[i]--;
        final_ans[i] = "P" + final_ans[i].toString();
      }
    }
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
})
module.exports = router;