$(document).ready(function(){
  console.log('ready');

  var intervalId;
  var  clockRunning = false;
  var category;
  var numQuestions;
  var level;
  var timeLength = 30000;

  // Our stopwatch object
  var stopwatch = {

    time: 0,

    start: function() {

      // DONE: Use setInterval to start the count here and set the clock to running.
      if (!clockRunning) {
          intervalId = setInterval(stopwatch.count, 1000);
          clockRunning = true;
      }
    },
    stop: function() {

      // DONE: Use clearInterval to stop the count here and set the clock to not be running.
      clearInterval(intervalId);
      clockRunning = false;
    },

    count: function() {

      // DONE: increment time by 1, remember we cant use "this" here.
      stopwatch.time++;

      // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
      //       and save the result in a variable.
      var converted = stopwatch.timeConverter(stopwatch.time);

      console.log(converted);

      // DONE: Use the variable we just created to show the converted time in the "display" div.
      $("#timer").html(converted);

    },
    timeConverter: function(t) {

      var minutes = Math.floor(t / 60);
      var seconds = t - (minutes * 60);

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      if (minutes === 0) {
        minutes = "00";
      }
      else if (minutes < 10) {
        minutes = "0" + minutes;
      }

      return minutes + ":" + seconds;
    }
  };


  function randomize (single, multiple) {
    multiple.push(single);
    multiple.sort(function(a, b){return 0.5 - Math.random()});
    return multiple;
  }

  $('#btnCategory').on('click',function(){
    category = $("#category option:selected").val();
    console.log(category);
  });

  $('#btnNumQuestions').on('click',function(){
    numQuestions = $("#numQuestions").val();
    console.log(numQuestions);
  });

  $('#btnLevel').on('click',function(){
    level = $("#level").val();
    console.log(level);
  });

  $('.start').on("click", function(e) {
    let username = e.target.value;
    stopwatch.start();
    setTimeout(stopwatch.stop,timeLength);

    var data;
    var questions = [];

    // Making an Ajax request
    $.ajax({
      url:'https://opentdb.com/api.php?amount='+ numQuestions +'&category='+category+'&difficulty=' + level + '&type=multiple',

    }).done(function(user) {

      data = user.results;
      console.log('Questions Returned');
      console.log(data);

      for(var i = 0; i < data.length; i++){
        questions.push({
          question: data[i].question,
          correct_answer: data[i].correct_answer,
          incorrect_answers: data[i].incorrect_answers,
          mixed_answers: randomize(data[i].correct_answer, data[i].incorrect_answers)
        });
      }
      console.log(questions);

      //Passing response object from ajax call
      $.each(questions , function(index , question){
        $('#profile').append(`
          <div class="panel panel-default">
            <div class="panel-heading">
              <h2 class="panel-title"><h3>Question #${index +1}: ${question.question}</h3></h2>
            </div>

            <div class="panel-body">

              <div class="" data-toggle="buttons">
                <label class="btn btn-primary col-sm-4 col-sm-offset-1 bottomSpace">
                  <input type="radio" name="${index}" id="${index}1" value='${question.mixed_answers[0]}' autocomplete="off"> ${question.mixed_answers[0]}
                </label>
                <label class="btn btn-primary col-sm-4 col-sm-offset-1 bottomSpace">
                  <input type="radio" name="${index}" id="${index}2" value='${question.mixed_answers[1]}' autocomplete="off">${question.mixed_answers[1]}
                </label>
                <label class="btn btn-primary col-sm-4 col-sm-offset-1 bottomSpace">
                  <input type="radio" name="${index}" id="${index}3" value='${question.mixed_answers[2]}' autocomplete="off">${question.mixed_answers[2]}
                </label>
                <label class="btn btn-primary col-sm-4 col-sm-offset-1 bottomSpace">
                  <input type="radio" name="${index}" id="${index}3" value='${question.mixed_answers[3]}' autocomplete="off">${question.mixed_answers[3]}
                </label>
              </div>

            </div>
          </div>
          `);
      });

      setTimeout(function(){
        var numberOfQuestions = questions.length;
        var correct = 0;
        var radioValue;

        for(var i = 0 ; i < numberOfQuestions; i++){
          radioValue = $("input:radio[name='" + i + "']:checked").val();
          console.log(radioValue);
          if(radioValue === questions[i].correct_answer){
            correct++;
          }
        }

        console.log('You got '+ correct +' out of '+ numberOfQuestions);
        $('#results').html('You got '+ correct +' out of '+ numberOfQuestions);
        $('#results').modal('show');

       },timeLength);

    });

  });
});
