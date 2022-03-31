/*
    Author: devCodeCamp
    Description: Most Wanted Starter Code
*/
//////////////////////////////////////////* Beginning Of Starter Code *//////////////////////////////////////////

"use strict";
//? Utilize the hotkey to hide block level comment documentation
////* Mac: Press "CMD"+"K" and then "CMD"+"/"
////* PC: Press "CTRL"+"K" and then "CTRL"+"/"

/**
 * This is the main logic function being called in index.html.
 * It operates as the entry point for our entire application and allows
 * our user to decide whether to search by name or by traits.
 * @param {Array} people        A collection of person objects.
 */
function app(people) {
    // promptFor() is a custom function defined below that helps us prompt and validate input more easily
    // Note that we are chaining the .toLowerCase() immediately after the promptFor returns its value
    let searchType = promptFor(
        "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
        yesNo
    ).toLowerCase();
    let searchResults;
    // Routes our application based on the user's input
    switch (searchType) {
        case "yes":
            searchResults = searchByName(people);
            break;
        case "no":
            let multiResult =  promptFor("Would you like to search by multiple traits? Press (yes) or (no) for single trait", yesNo);
            if (multiResult === 'yes'){
                searchByMultipleTraits(people)
            }
            else if(multiResult === 'no')
                searchByTrait(people);
            break;
        default:
            // Re-initializes the app() if neither case was hit above. This is an instance of recursion.
            app(people);
            break;
    }
    // Calls the mainMenu() only AFTER we find the SINGLE PERSON
    mainMenu(searchResults, people);
}
// End of app()

/**
 * After finding a single person, we pass in the entire person-object that we found,
 * as well as the entire original dataset of people. We need people in order to find
 * descendants and other information that the user may want.
 * @param {Object[]} person     A singular object inside of an array.
 * @param {Array} people        A collection of person objects.
 * @returns {String}            The valid string input retrieved from the user.
 */
function mainMenu(person, people) {
    // A check to verify a person was found via searchByName() or searchByTrait()
    if (!person[0]) {
        alert("Could not find that individual.");
        // Restarts app() from the very beginning
        return app(people);
    }
    let displayOption = prompt(
        `Found ${person[0].firstName} ${person[0].lastName}. Do you want to know their 'info', 'family', or 'descendants'?\nType the option you want or type 'restart' or 'quit'.`
    );
    switch (displayOption) {
        case "info":
            function findPersonInfo(person){
            return person; 
            }
            let personInfo = findPersonInfo(person[0]);
            displayPerson(personInfo);
            break;
        case "family":
            function recursiveFindFamily(person, people, subArray= []){
                let recurseFamily = people.filter(function(el){
                    let subArray = el.parents;
                    for (let i = 0; i < person.parents.length; i++){    
                        if (el.id === person.parents[i])
                        return true;

                    }
                    if (el.id === person.currentSpouse){
                        return true;
                    }
                
                    for (let i = 0; i < subArray.length; i++){
                        if (el.parents[i] === person.parents[0] || el.parents[i]===person.parents[1]){
                            return true;
                        }       
                    }
                    for (let i = 0; i < subArray.length; i++){
                        if (el.parents[i] === person.id)
                        return true;
                    }    
                })
                return recurseFamily;
            }
               


            //! TODO: Declare a findPersonFamily function //////////////////////////////////////////
            // HINT: Look for a people-collection stringifier utility function to help
            let personFamily = recursiveFindFamily(person[0], people);
            displayPeople(personFamily);
            break;
        case "descendants":
            function findPersonDescendants(person, people){
                let personOffspring=people.filter(function(el){
                    if (el.parents[0]===person.id || el.parents[1]===person.id)
                    return true
                })
                return personOffspring
            }
                

            //! TODO: Declare a findPersonDescendants function //////////////////////////////////////////
            // HINT: Review recursion lecture + demo for bonus user story
            let personDescendants = findPersonDescendants(person[0], people);
            displayPeople(personDescendants);
            break;
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        default:
            // Prompt user again. Another instance of recursion
            return mainMenu(person, people);
    }
}
// End of mainMenu()

/**
 * This function is used when searching the people collection by
 * a person-object's firstName and lastName properties.
 * @param {Array} people        A collection of person objects.
 * @returns {Array}             An array containing the person-object (or empty array if no match)
 */
function searchByName(people) {
    let firstName = promptFor("What is the person's first name?", chars).toLowerCase();
    let lastName = promptFor("What is the person's last name?", chars).toLowerCase();
    let newFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
    let newLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1)

    // The foundPerson value will be of type Array. Recall that .filter() ALWAYS returns an array.
    let foundPerson = people.filter(function (person) {
        if (person.firstName === newFirstName && person.lastName === newLastName) {
            return true;
        }
    });
    return foundPerson;
}
// End of searchByName()

/**
 * This function will be useful for STRINGIFYING a collection of person-objects
 * first and last name properties in order to easily send the information
 * to the user in the form of an alert().
 * @param {Array} people        A collection of person objects.
 */
function displayPeople(people) {
    alert(
        people
            .map(function (person) {
                return `${person.firstName} ${person.lastName}`;
            })
            .join("\n")
    );
}
// End of displayPeople()

/**
 * This function will be useful for STRINGIFYING a person-object's properties
 * in order to easily send the information to the user in the form of an alert().
 * @param {Object} person       A singular object.
 */
function displayPerson(person) {
    let personInfo = `First Name: ${person.firstName}\n`;
    personInfo += `Last Name: ${person.lastName}\n`;
    personInfo += `Gender: ${person.gender}\n`;
    personInfo += `Dob: ${person.dob}\n`;
    personInfo += `Height: ${person.height}\n`;
    personInfo += `Weight: ${person.weight}\n`;
    personInfo += `Eye Color: ${person.eyeColor}\n`;
    personInfo += `Occupation: ${person.occupation}\n`;
    personInfo += `Parents: ${person.parents}\n`;
    personInfo += `Current Spouse: ${person.currentSpouse}\n`;
   
    alert(personInfo);
}
// End of displayPerson()

/**
 * This function's purpose is twofold:
 * First, to generate a prompt with the value passed in to the question parameter.
 * Second, to ensure the user input response has been validated.
 * @param {String} question     A string that will be passed into prompt().
 * @param {Function} valid      A callback function used to validate basic user input.
 * @returns {String}            The valid string input retrieved from the user.
 */
function promptFor(question, valid) {

    do {
        var response = prompt(question).trim()

    } while (!response || !valid(response));
  
    return response
}
// End of promptFor()

/**
 * This helper function checks to see if the value passed into input is a "yes" or "no."
 * @param {String} input        A string that will be normalized via .toLowerCase().
 * @returns {Boolean}           The result of our condition evaluation.
 */
function yesNo(input) {
    return input.toLowerCase() === "yes" || input.toLowerCase() === "no";
}
// End of yesNo()

/**
 * This helper function operates as a default callback for promptFor's validation.
 * Feel free to modify this to suit your needs.
 * @param {String} input        A string.
 * @returns {Boolean}           Default validation -- no logic yet.
 */
function chars(input) {
    return true;
}
// End of chars()

//////////////////////////////////////////* End Of Starter Code *//////////////////////////////////////////
// Any additional functions can be written below this line 👇. Happy Coding! 😁
/*function searchByTrait(people){

    let traitValue = promptFor("What is the person's last name?", chars);
    let byTrait = people.map(function(el){
        if( el.firstName === traitValue)
        return el.firstName;
    })

    return byTrait

}


*/

function searchByTrait (people){
    let traitChoice = promptFor("Which trait would you like to search by? (a) Gender (b) Eye Color (c) Height (cm) (d) Weight (lbs) (e) Search by multiple traits ", chars)
    let traitValue = promptFor("Which trait would you like? ", chars)
    switch(traitChoice){
        case "a": 
            function searchByGender(people){
            let genderSearch = people.filter(function(el){
                if (el.gender === traitValue){
                return true;
             }})
             return genderSearch;
            }
            let genderSearch = searchByGender(people)
            displayPeople(genderSearch);
            break;
        case "b": 
            function searchByEyeColor(people){
            let eyeSearch = people.filter(function(el){
                if (el.eyeColor === traitValue){
                return true;
             } })
             return eyeSearch;
            }
            eyeColorSearch = searchByEyeColor(people)
            displayPeople(eyeColorSearch);
            break;
            
        case "c": 
            function searchByHeight(people){
            let heightSearch = people.filter(function(el){
                if (el.height === traitValue){
                return true;
             } })
             return heightSearch;
            }
            let heightSearch = searchByHeight(people)
            displayPeople(heightSearch);
            break;
        case "d": 
            function searchByWeight(people){
            let weightSearch = people.filter(function(el){
                if (el.weight === traitValue){
                return true;
             } })
             return weightSearch;
            }
            let weightSearch = searchByWeight(people)
            displayPeople(weightSearch);
            break;
        case "e": 
            function searchByMultipleTraits(people){
            let weightSearch = people.filter(function(el){
                if (el.weight === traitValue){
                return true;
             } })
             return weightSearch;
            }
            let multiSearch = searchByMultipleTraits(people)
            displayPeople(multiSearch);
            break;
    
    

  
}

        


}

 
       
function multiTraitPrompt(){
    let userInput = promptFor("Which gender would you like to select?  press enter to skip", chars);
    let userInput2 = promptFor("Which eye color would you like to select? press n to skip. ", chars);
    let userInput3 = promptFor("Which weight would you like to select?. press n to skip", chars);
    let userInput4 = promptFor("Which height would you like to select?. press n to skip", chars);
    let userInput5 = promptFor("Which date of birth would you like to select?. press n to skip ", chars);

}


function searchByMultipleTraits(people, userInput,userInput2,userInput3,userInput4,userInput5){
    
let narrowedSearch = people.filter(function(el){
    if (userInput === el.eyeColor || userInput === "n"){
        return true;
    }
}
)?.filter(function(el){
    if (userInput2 === el.gender || userInput2 === "n"){
        return true;
    }
}
)?.filter(function(el){
    if (userInput3 === el.height || userInput3 === "n"){
        return true;    }
}
)?.filter(function(el){
    if (userInput4 === el.weight || userInput4 === "n"){
        return true;
    }
}
)?.filter(function(el){
    if (userInput5 === el.dob|| userInput5 === "n"){
        return true;
    }
}
)
return narrowedSearch
}




 