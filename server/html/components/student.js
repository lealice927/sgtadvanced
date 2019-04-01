

class Student {
	/* constructor - take in params for the student and save them,
		create storage for student dom elements
		store the deletion callback from the model
		bind event handlers
	params: 
		(number) id - the id of this student
		(string) name - the name of the student
		(string) course - the course of the student
		(number) grade - the grade of the student
		(function) deleteCallback - the removal function from the model to call when this student wants to be removed from the model's list
	return: undefined (don't return undefined, it will screw it up a constructor, don't put a return)
	ESTIMATED TIME: 30 minutes to understand
	*/
	constructor(id, name, course, grade, deleteCallback = () => { }) {
		//this method has been built out to help you understand the general structure better
		this.data = {
			id: id,
			name: name,
			course: course,
			grade: parseInt(grade)
		}
		this.deleteCallback = deleteCallback;
		this.domElements = {
			row: null,
			name: null,
			course: null,
			grade: null,
			operations: null,
			deleteButton: null
		}
		this.handleDelete = this.handleDelete.bind(this);
	}
	/* update - change a value in the student record
	purpose: ensure that the field is one that can be changed (either id, name, course, or grade)
		if not changable, return false
		otherwise update the value 
			save the value into the properties stored in the constructor
			go to the dom element of the appropriate field and change the text
				(for example, if name was changed, go to the student's name TD and change the name as well)
			and return true
	params: 
		(string) field - the field in the object to change
		(multiple) value - the value to change the field to
	return: (boolean) true if it was changed, false if it was not
	ESTIMATED TIME: 1.5 hours
	*/
	update(field, value) {
		if(this.data[field] === undefined){
			return false;
		} else {
			if(field === "grade") {
				value = parseInt(value); 
			}
			this.data[field] = value;
			$(this.domElements[field]).text(value);
			return true;
		}
	}
	/* getData - get all the student data as a simple object
	params: none
	return: (object) an object with the following data
		(number): id
		(string): name
		(string): course
		(number): grade
	ESTIMATED TIME: 30 minutes
	*/
	getData() {
		return this.data
	}
	/* render - create and return a table row (TR) with 4 table cells (TD) in them:
		name : the student's name
		course : the student's course
		grade: the student's grade
		operations: holds any buttons for the student - will hold a delete button
	purpose: 
		create the TR and 4 TDs, 
		put the 4 TDs inside the TR.  
		Add the button to the operation TD
		add the StudentRecord's handleDelete method to the delete button's click handler
		store all these values for eventual change
		return the TR
	params: none
	return: (jquery dom element) the row that contains the student dom elements
	ESTIMATED TIME: 2 hours
	*/
	render() {
		this.domElements.row = $('<tr>');
		this.domElements.name = $('<td>').text(this.data.name);
		this.domElements.course = $('<td>').text(this.data.course);
		this.domElements.grade = $('<td>').text(this.data.grade);
		this.domElements.operations = $('<td>'); //holds any buttons for the student
		this.domElements.deleteButton = $('<button>').text('delete').click(this.handleDelete); //will generate delete btn

		this.domElements.operations.append(this.domElements.deleteButton);
		this.domElements.row.append(this.domElements.name, this.domElements.course, this.domElements.grade, this.domElements.operations);

		$('#displayArea').append(this.domElements.row)
		return this.domElements.row
	}
		/* handleDelete - call the model delete callback, and remove this student's dom element
		purpose: 
			call the callback that was passed into the constructor by the model - give it this object's reference
			remove this object's dom element row to erase the entire dom element
		ESTIMATED TIME: 15 minutes
		*/
		handleDelete() {
			this.deleteCallback(this.data.id);
			return this.domElements.row.remove();
		}
	}
	