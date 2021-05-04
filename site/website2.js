recalculateServiceTime();
$('.priority-only').hide();

$(document).ready(function () 
{
  $('input[type=radio][name=algorithm]').change(function () 
  {
    if (this.value == 'priority') 
    {
      $('.priority-only').show();
      $('.servtime').show();
      $('.completiontime').show();
      $('.turnaroundtime').show();
      $('#minus').css('left', '604px');
    }
    else 
    {
      $('.priority-only').hide();
      $('.servtime').show();
      $('.completiontime').show();
      $('.turnaroundtime').show();
      $('#minus').css('left', '428px');
    }

    if (this.value == 'robin') 
    {
      $('.servtime').show();
      $('.completiontime').show();
      $('.turnaroundtime').show();
      $('#quantumParagraph').show();
    }
    else 
    {
      $('#quantumParagraph').hide();
      $('.servtime').show();
      $('.turnaroundtime').show();
    }

    recalculateServiceTime();
  });
});

function addRow() 
{
  var lastRow = $('#inputTable tr:last');
  var lastRowNumebr = parseInt(lastRow.children()[1].innerText);

  var newRow = '<tr><td>P'
  + (lastRowNumebr + 1)
  + '</td><td>'
  + (lastRowNumebr + 1)
  + '</td><td><input class="exectime" type="text"/></td><td class="servtime"></td>'
  //if ($('input[name=algorithm]:checked', '#algorithm').val() == "priority")
  + '<td class="priority-only"><input type="text"/></td>'
  + '<td class="completiontime"></td><td class="turnaroundtime"></td></tr>';
  lastRow.after(newRow);

  var minus = $('#minus');
  minus.show();
  minus.css('top', (parseFloat(minus.css('top')) + 24) + 'px');

  if ($('input[name=algorithm]:checked', '#algorithm').val() != "priority")
    $('.priority-only').hide();


  $('#inputTable tr:last input').change(function () 
  {
    recalculateServiceTime();
  });
}

function deleteRow() 
{
  var lastRow = $('#inputTable tr:last');
  lastRow.remove();

  var minus = $('#minus');
  minus.css('top', (parseFloat(minus.css('top')) - 24) + 'px');


  if (parseFloat(minus.css('top')) < 150)
    minus.hide();
}

$(".initial").change(function () 
{
  recalculateServiceTime();
});
function recalculateServiceTime() 
{
  var inputTable = $('#inputTable tr');
  var totalExectuteTime = 0;
  
  var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
  if (algorithm == "priority") 
  {
    var exectuteTimes = [];
    var priorities = [];
    var arrivals=[];    
    $.each(inputTable, function (key, value) 
    {
      if (key == 0) 
        return true;
      
      exectuteTimes[key - 1] = parseInt($(value.children[2]).children().first().val());
      priorities[key - 1] = parseInt($(value.children[4]).children().first().val());
      arrivals[key-1]=parseInt($(value.children[1]).children().first().val());
      if(key-1==0)
      {
        priorities[key-1]=10000;
      }
    });

    
    var currentIndex = -1;
    var completiontime=[];
    var turnaroundtime=[];
    for (var i = 0; i < exectuteTimes.length; i++) 
    {
      
      currentIndex = findNextIndexWithPriority(currentIndex, priorities);
      
      if (currentIndex == -1) return;

      $(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);
      completiontime[currentIndex]=totalExectuteTime+exectuteTimes[currentIndex]
      $(inputTable[currentIndex + 1].children[5]).text(completiontime[currentIndex]);
      turnaroundtime[currentIndex]=completiontime[currentIndex]-currentIndex;
      $(inputTable[currentIndex + 1].children[6]).text(turnaroundtime[currentIndex]);
      totalExectuteTime += exectuteTimes[currentIndex];
    }
  }
  else if (algorithm == "robin") 
  {
    var quantum = $('#quantum').val();
    var exectuteTimes = [];
    var completiontime=[];
    var totalExectuteTime=0;
    var static=parseInt(quantum);
    var arrivals=[];

    $('#minus').css('left', '335px');
    $.each(inputTable, function (key, value) 
    {
      if (key == 0) 
        return true;
      
      exectuteTimes[key - 1] = parseInt($(value.children[2]).children().first().val());
      arrivals[key-1]=parseInt($(value.children[1]).children().first().val());
    });

    for(i=0;i<exectuteTimes.length;i++)
    {
      //if (key == 0) return true;
      $(inputTable[i+1].children[3]).text(totalExectuteTime);
        totalExectuteTime+=static;

      if(exectuteTimes[i]<quantum)
      {
        totalExectuteTime=totalExectuteTime+exectuteTimes[i]-static;
      }
    }
    var total=0;
    var areWeThereYet=false;
    while (!areWeThereYet) 
    {
      areWeThereYet = true;
      for(var j=0;j<exectuteTimes.length;j++)
      {
        if (exectuteTimes[j] > 0) 
        {
            if(exectuteTimes[j]<=quantum)
            {
              total=total+exectuteTimes[j];
              completiontime[j]=total;
            }
            else 
            {
              total=total+quantum;
            } 
          exectuteTimes[j] -= quantum;
          areWeThereYet = false;
        }
      }
    }
    var c=[];
    for(i=0;i<exectuteTimes.length;i++)
    {
      c[i]=0;
      for(j=completiontime[i];j!=0;)
      {
        c[i]=c[i]+j%10;
        j=parseInt(j/10);
      }
    }
    var turnaroundtime=[];
    for(i=0;i<exectuteTimes.length;i++)
    {
      //if (key == 0) return true;
      $(inputTable[i+1].children[5]).text(c[i]);
      turnaroundtime[i]=c[i]-i;
      $(inputTable[i+1].children[6]).text(turnaroundtime[i]);
    }   
  }
}

function findNextIndexWithPriority(currentIndex, priorities) 
{
  var currentPriority = 1000000;
  if (currentIndex != -1) currentPriority = priorities[currentIndex];
  var resultPriority = 0;
  var resultIndex = -1;
  var samePriority = false;
  var areWeThereYet = false;

  $.each(priorities, function (key, value) 
  {
    var changeInThisIteration = false;

    if (key == currentIndex) 
    {
      areWeThereYet = true;
      return true;
    }
    if (value <= currentPriority && value >= resultPriority) 
    {
      if (value == resultPriority) 
      {
        if (currentPriority == value && !samePriority) 
        {
          samePriority = true;
          changeInThisIteration = true;
          resultPriority = value;
          resultIndex = key;                            
        }                        
      }
      else if (value == currentPriority) 
      {
        if (areWeThereYet) 
        {
          samePriority = true;
          areWeThereYet = false;
          changeInThisIteration = true;
          resultPriority = value;
          resultIndex = key;
        }
      }
      else 
      {
        resultPriority = value;
        resultIndex = key;
      }

      if (value > resultPriority && !changeInThisIteration)
        samePriority = false;
    }
  });
  return resultIndex;
}

function findNextIndex(currentIndex, array) 
{
  var currentTime = 0;
  if (currentIndex != -1) currentTime = array[currentIndex];            
  var resultTime = 1000000;
  var resultIndex = -1;
  var sameTime = false;
  var areWeThereYet = false;

  $.each(array, function (key, value) 
  {
    var changeInThisIteration = false;

    if (key == currentIndex) 
    {
      areWeThereYet = true;
      return true;
    }
    if (value >= currentTime && value <= resultTime) 
    {
      if (value == resultTime) 
      {                        
        if (currentTime == value && !sameTime) 
        {
          sameTime = true;
          changeInThisIteration = true;
          resultTime = value;
          resultIndex = key;                            
        }                        
      }
      else if (value == currentTime) 
      {
        if (areWeThereYet) 
        {
          sameTime = true;
          areWeThereYet = false;
          changeInThisIteration = true;
          resultTime = value;
          resultIndex = key;
        }
      }
      else 
      {
        resultTime = value;
        resultIndex = key;
      }

      if (value < resultTime && !changeInThisIteration)
        sameTime = false;
    }
  });
  return resultIndex;
}

function animate() 
{
  /*$('fresh').prepend('<div id="curtain" style="position: absolute; right: 0; width:100%; height:100px;"></div>');
  
  $('#curtain').width($('#resultTable').width());
  $('#curtain').css({left: $('#resultTable').position().left});
  */
  var sum = 0;
  $('.exectime').each(function() 
  {
      sum += Number($(this).val());
  });
  
  console.log($('#resultTable').width());
  var distance = $("#curtain").css("width");
  
  animationStep(sum, 0);

  jQuery('#curtain').animate({ width: '0', marginLeft: distance}, sum*1000/2, 'linear');
}

function animationStep(steps, cur) 
{
  
  if(cur < steps) 
  {
    
    setTimeout(function()
    { 
         animationStep(steps, cur + 1);
    }, 500);

  }
  if(cur = steps)
  {
    $('#timer').html(cur);
  }
  else 
  {
  }

}

function draw() 
{
  $('fresh').html('');
  var inputTable = $('#inputTable tr');
  var th = '';
  var td = '';
  var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
  if (algorithm == "priority") 
  {
    var executeTimes = [];

    $.each(inputTable, function (key, value) 
    {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[2]).children().first().val());
      var priority = parseInt($(value.children[4]).children().first().val());
      //var arrivals = parseInt($(value.childrem[1]).children().first().val());
      if(key==1)
      {
        priority=1000;
      }
      executeTimes[key - 1] = { "executeTime": executeTime, "P": key - 1, "priority": priority };
    });

    executeTimes.sort(function (a, b) 
    {
      if (a.priority == b.priority)
        return a.P - b.P;
      return b.priority - a.priority
    });

    $.each(executeTimes, function (key, value) 
    {
      th += '<th style="height: 60px; width: ' + value.executeTime * 20 + 'px;">P' + value.P + '</th>';
      
      td += '<td>' + value.executeTime + '</td>';
    });

    $('fresh').html('<table id="resultTable" style="width: 70%"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  else if (algorithm == "robin") 
  {
    var quantum = $('#quantum').val();
    var executeTimes = [];

    $.each(inputTable, function (key, value) 
    {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[2]).children().first().val());
      executeTimes[key - 1] = { "executeTime": executeTime, "P": key - 1 };
    });
   // var completiontime=[];
    var areWeThereYet = false;
    while (!areWeThereYet) 
    {
      areWeThereYet = true;
      $.each(executeTimes, function (key, value) 
      {
        if (value.executeTime > 0) 
        {
          th += '<th style="height: 60px; width: ' + (value.executeTime > quantum ? quantum : value.executeTime) * 20 + 'px;">P' + value.P + '</th>';
          td += '<td>' + (value.executeTime > quantum ? quantum : value.executeTime) + '</td>';
          value.executeTime -= quantum;
          areWeThereYet = false;
        }

      });
    }
    $('fresh').html('<table id="resultTable" style="width: 70%"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  animate();
}