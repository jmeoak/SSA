var xmasTree = '               / \\ \n' + 
'            <     > \n' + 
'               \\ / \n' + 
'               / \\ \n' + 
'              /    \\ \n' + 
'             /+++\\ \n' + 
'            /   ()    \\ \n' + 
'           /            \\ \n' + 
'          /~`~`~`~` \\ \n' + 
'         /   ()     ()    \\ \n' + 
'        /                   \\ \n' + 
'       /&*&*&*&*&*&\\ \n' + 
'      /    ()     ()    ()    \\ \n' + 
'     /                           \\ \n' + 
'    /++++++++++++++\\ \n' + 
'   /   ()      ()      ()     ()  \\ \n' + 
'  /*&*&*&*&*&*&*&*&*&\\ \n' + 
' /                                     \\ \n' + 
'/,.,.,.,.,.,.,.,.,.,.,.,.,.,..,.,.,.,.,.,\\ \n' + 
'              |        | \n' + 
'              |```````| \n' + 
'             \\_____/'
// safe remove will only remove if the value is found
function safe_remove(arr1, rem){
    var index = arr1.indexOf(rem)
    if(index > -1){
        arr1.splice(index, 1)
    }
    return arr1
}

// Looping overarching algorithm
// takes in person and returns a circle
function secret_santa_algorithm(fam){
    var peopleList = []
    for(var i = 0; i < fam.length; i++) {
        peopleList.push(fam[i].name)
    }
    var not_chosen = peopleList.slice()
    var result = []
    for(var i = 0; i < fam.length; i++){
        // person
        var chooser = fam[i].name
        var spouse = fam[i].spouse
        // var lastYear = fam[i].lastYear
        var choice_options = not_chosen.slice()
        if (spouse != "null"){
            //console.log(chooser)
            choice_options = safe_remove(choice_options, spouse)
            ////var index = choice_options.indexOf(spouse)
            ////choice_options.splice(, 1) // pop off spouse
        } // will add in pop for previous year here ----
        //choice_options = safe_remove(choice_options, lastYear)
        choice_options = safe_remove(choice_options, chooser)
        if(choice_options.length == 0){
            return secret_santa_algorithm(fam)
        }
        var choice = choice_options[Math.floor(Math.random() * choice_options.length)]
        not_chosen = safe_remove(not_chosen, choice)
        result.push({chooser,choice})

    }

    return result

}

function secret_santa(family){

    var circle_valid = false;
    var circle = secret_santa_algorithm(family);
    //console.log(circle)
    if(circle.length<2){
        return
    }
    while(!circle_valid){
        var firstPair = circle[0]
        var nextPair = circle[0] 
        for(var j=0; j<circle.length; j++){
            // find next pair
            var choice = nextPair.choice
            for(var k=0; k<circle.length; k++){
                if(circle[k].chooser==choice){
                    nextPair = circle[k]
                    //console.log("Next pair")
                    //console.log(nextPair)
                }
            }
            if(nextPair.chooser==firstPair.chooser && j == circle.length-1){
                circle_valid = true;
            } else if (nextPair.chooser==firstPair.chooser && j != circle.length-1){
                //console.log("broke")
                break
            }

        }
        if(circle_valid){
            return circle
        }
       // counter++
       // if(counter==20){
       //     console.log("Broke")
       //     break
        //}
      //  console.log("doesnt work")
        circle = secret_santa_algorithm(family);
    }
    return circle
  
}

function send_emails(data, circle) {
  
  for (var i = 1; i < data.length; i++) { // data.length
    var person = data[i];
    var name = person[0];
    var email = person[1];
    var giftie = ""
    for(var j = 0; j < circle.length; j++){
      if(circle[j].chooser == name){
        giftie = circle[j].choice             
      }
    }
    var message =  'Dear ' + name + '\n\nThis year you will be getting a gift for ' + giftie + '\n\n Merry Christmas!! \n\n' + xmasTree
                     

    var subject = '2021 Secret Santa!!!'
    MailApp.sendEmail(email, subject, message);
  }
}

function circle_print(circle, print){
    var current = circle[0].choice
    var list = ""
    var nextPair = circle[0]
    for(var i =0; i<circle.length; i++){
        list = list + nextPair.chooser + " --> "
        current = nextPair.choice
        for(var k=0; k<circle.length; k++){
            if(circle[k].chooser==current){
                nextPair = circle[k]
            }
        }
    }
    list = list + circle[0].chooser
    if(print == true){
      console.log("Nice Circle")
      console.log(list)
    } 
    return list
}


function main() {

  console.log("starting up program")
  //Uncomment this section to bring the Google data in
  var currSheet =  SpreadsheetApp.getActiveSheet();
  var dataRange = currSheet.getDataRange();
  var data = dataRange.getValues();
  //var data = fake_data // bring in testing data

  var fam_list = [];
  // Creates each person in the family
  for (var i = 1; i < data.length; i++){
    var person = {
        name: data[i][0],
        email: data[i][1],
        spouse: data[i][2],
        lastYear: data[i][3]
    }
    fam_list.push(person);
  }

  // Run the secret santa program
  var circle = secret_santa(fam_list)
  //console.log("Here is the circle")
  //console.log(circle)

  //Circle Printer
  var full_list = circle_print(circle, false)
  
  // Send emails to people
  send_emails(data, circle);
  
  
  var email_A = 'dev.meoak@gmail.com'
  var message_A =  'Dear Admin\n\n\nBelow is the full list of everyone. This is just a bunch of text to make it hard to see. It is entirely here for junk purposes and does nothing but make the email preview now include the answers. That is all. \n\n' + xmasTree + full_list + '\n\nMerry Christmas!! \n\n' + xmasTree
  var subject_A = '2020 Barrett Secret Santa - Admin Email'
  
  MailApp.sendEmail(email_A, subject_A, message_A);
}


// Entry point for code
// remove if running from google script
//console.log("Starting up")
//main()
