


class SGT_template {
	/* constructor - sets up sgt object 
	params: (object) elementConfig - all pre-made dom elements used by the app
	purpose: 
		- Instantiates a model and stores pre-made dom elements in this object
		- Additionally, will generate an object to store created students 
		  who exists in our content management system (CMS)
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	constructor(elementConfig) {
		this.elementConfig = elementConfig;
		this.data = {};

		this.handleAdd = this.handleAdd.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.getDataSuccess = this.getDataSuccess.bind(this);
		this.sendDataSuccess = this.sendDataSuccess.bind(this);
		this.deleteDataSuccess = this.deleteDataSuccess.bind(this);
		this.handleError = this.handleError.bind(this);
		this.deleteStudent = this.deleteStudent.bind(this);
		this.doesStudentExist = this.doesStudentExist.bind(this);
		this.getDataFromServer = this.getDataFromServer.bind(this);
	}
	/* addEventHandlers - add event handlers to premade dom elements
	adds click handlers to add and cancel buttons using the dom elements passed into constructor
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/

	addEventHandlers() {
		$('#addButton').click(this.handleAdd);
		$('#cancelButton').click(this.handleCancel);
		$('#getDataButton').click(this.getDataFromServer);
	}

	/* clearInputs - take the three inputs stored in our constructor and clear their values
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	clearInputs() {
		this.elementConfig.nameInput.val("");
		this.elementConfig.courseInput.val("");
		this.elementConfig.gradeInput.val("");
	}
	/* handleCancel - function to handle the cancel button press
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	handleCancel() {
		this.clearInputs();
	}

	getData() {
		var sgt = this;
		var ajaxConfig = {
			dataType: 'json',
			data: { "api_key": "I1a9Xq1NT4" },
			method: "POST",
			url: "http://s-apis.learningfuze.com/sgt/get",
			success: function (response) {
				console.log("Response: ", response);
				for (var key = 0; key < response.data.length; key++) {
					var students = response.data[key];
					sgt.createStudent(students.name, students.course, students.grade, students.id);
					sgt.displayAllStudents();
				}
			}
		}
		$.ajax(ajaxConfig);
	}


	/* handleAdd - function to handle the add button click
	purpose: grabs values from inputs, utilizes the model's add method to save them, then clears the inputs and displays all students
	params: none
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	handleAdd() {
		var studentName = this.elementConfig.nameInput.val();
		var studentCourse = this.elementConfig.courseInput.val();
		var studentGrade = this.elementConfig.gradeInput.val();

		this.createStudent(studentName, studentCourse, studentGrade);
		this.displayAllStudents();
		this.clearInputs();

	}
	/* displayAllStudents - iterate through all students in the model
	purpose: 
		grab all students from model, 
		iterate through the retrieved list, 
		then render every student's dom element
		then append every student to the dom's display area
		then display the grade average
	params: none
	return: undefined
	ESTIMATED TIME: 1.5 hours
	*/
	displayAllStudents() {
		$('#displayArea').empty();
		for (var student in this.data) { //for in loop to iterate thru all students
			this.data[student].render();
		}
		this.displayAverage();
	}
	/* displayAverage - get the grade average and display it
	purpose: grab the average grade from the model, and show it on the dom
	params: none
	return: undefined 
	ESTIMATED TIME: 15 minutes

	*/

	displayAverage() {
		var counter = 0;
		var total = 0;

		for (var key in this.data) {
			total += this.data[key].getData().grade;
			counter++
		}
		$(".avgGrade").text((total / counter).toFixed(2));
	}
	/* createStudent - take in data for a student, make a new Student object, and add it to this.data object

		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	purpose: 
			If no id is present, it must pick the next available id that can be used
			when it creates the Student object, it must pass the id, name, course, grade, 
			and a reference to SGT's deleteStudent method
	params: 
		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	return: false if unsuccessful in adding student, true if successful
	ESTIMATED TIME: 1.5 hours
	*/
	createStudentForm(name, course, grade){
        this.sendNewStudentData(name, course, grade);
    }
    createStudent(name, course, grade, id){
        if (name && course && grade) {
            this.data[id] = new Student (id, name, course, grade, this.deleteStudentData);
        }
    };
	// createStudent(name, course, grade, id) {
	// 	var studentKeyStorage = Object.keys(this.data)

	// 	if (this.doesStudentExist(id)) {
	// 		return false;
	// 	} else if (id === undefined && studentKeyStorage.length === 0) {
	// 		id = 1;
	// 	} else if (id === undefined && studentKeyStorage.length > 0) {
	// 		id = parseInt(studentKeyStorage[studentKeyStorage.length - 1]) + 1;
	// 	}
	// 	if (name && course && grade && id) {
	// 		var newStudent = new Student(id, name, course, grade, this.deleteStudent);
	// 		this.data[id] = newStudent;
	// 		return true;

	// 	}

	// }

	/* doesStudentExist - 
		determines if a student exists by ID.  returns true if yes, false if no
	purpose: 
			check if passed in ID is a value, if it exists in this.data, and return the presence of the student
	params: 
		id: (number) the id of the student to search for
	return: false if id is undefined or that student doesn't exist, true if the student does exist
	ESTIMATED TIME: 15 minutes
	*/
	doesStudentExist(id) {
		if (this.data.hasOwnProperty(id)) {
			return true;
		} else {
			return false;
		}
	}
	/* readStudent - 
		get the data for one or all students
	purpose: 
			determines if ID is given or not
			if ID is given, return the student by that ID, if present
			if ID is not given, return all students in an array
	params: 
		id: (number)(optional) the id of the student to search for, if any
	return: 
		a singular Student object if an ID was given, an array of Student objects if no ID was given
		ESTIMATED TIME: 45 minutes
	*/
	readStudent(id) {
		if (!!id && this.data.hasOwnProperty(id)) { //if id is given and exists
			return this.data[id] //return student by id if present
		} else if (!!id && !this.data.hasOwnProperty(id)) {
			return false;
		}
		if (!id) {
			return Object.values(this.data); //return all students in array
		}

		// var students = [];
		// if (id === undefined) {
		// 	students = Object.values(this.data);
		// 	return students;
		// } else if (id !== undefined) {
		// 	if (this.doesStudentExist(id)) {
		// 		return this.data[id];
		// 	} else {
		// 		return false;
		// 	}

		// }

	}
	/* updateStudent - 
		not used for now.  Will be used later
		pass in an ID, a field to change, and a value to change the field to
	purpose: 
		finds the necessary student by the given id
		finds the given field in the student (name, course, grade)
		changes the value of the student to the given value
		for example updateStudent(2, 'name','joe') would change the name of student 2 to "joe"
	params: 
		id: (number) the id of the student to change in this.data
		field: (string) the field to change in the student
		value: (multi) the value to change the field to
	return: 
		true if it updated, false if it did not
		ESTIMATED TIME: no needed for first versions: 30 minutes
	*/
	updateStudent(id, field, value) {
		if (this.doesStudentExist(id)) {
			this.data[id].update(field, value);
			return true;
		} else {
			return false;
		}
	}
	/* deleteStudent - 
		delete the given student at the given id
	purpose: 
			determine if the ID exists in this.data
			remove it from the object
			return true if successful, false if not
			this is often called by the student's delete button through the Student handleDelete
	params: 
		id: (number) the id of the student to delete
	return: 
		true if it was successful, false if not
		ESTIMATED TIME: 30 minutes
	*/
	deleteStudent(id) {
		if (this.doesStudentExist(id)) {
			delete this.data[id];
			var ajaxObj = {
				url: '/apis/grades?student_id' +id,
				method: 'delete',
			}
			$.ajax(ajaxObj)
			return true;
		} else {
			return false;
		}
	}
	getDataFromServer() {

		var ajaxOptions = {
			url: 'api/grades',
			method: 'get',
			data: { 'api_key': 'I1a9Xq1NT4' },
			dataType: 'json',
			success: this.getDataSuccess,
			error: this.handleError
		}
		$.ajax(ajaxOptions);
	}
	getDataSuccess(response) {
		if (response.success) { //if success is true
			for (var index = 0; index < response.data.length; index++) {
				var student = response.data[index];
				this.createStudent(student.name, student.course, student.grade, student.id);
			}
			this.displayAllStudents();
		} else { //if success is false
			var errorMessage = response.errors;
			console.log(errorMessage)
		}
	}
	
	sendNewStudentData(name, course, grade) {

		var ajaxObject = {
			url: 'http://s-apis.learningfuze.com/sgt/create',
			method: 'post',
			data: {
				'api_key': 'I1a9Xq1NT4',
				'name': name,
				'course': course,
				'grade': grade
			},
			dataType: 'json',
			success: this.sendDataSuccess,
			error: this.handleError

		}
		$.ajax(ajaxObject);
	}
	sendDataSuccess(response) {
		if (response.success) { //if success is true
			this.clearInputs();
			this.getDataFromServer();
		} else { //if success is false
			var errorMessage = response.errors;
			console.log(errorMessage)
		}
	}

	deleteStudentData(id) {

		var ajaxObj = {
			url: 'http://s-apis.learningfuze.com/sgt/delete',
			method: 'delete',
			data: {
				'api_key': 'I1a9Xq1NT4',
				'student_id': id
			},
			dataType: 'json',
			success: this.deleteDataSuccess,
			error: this.handleError

		}
		$.ajax(ajaxObj);
	}
	deleteDataSuccess(response) {
		if (response.success) { //if success is true
			this.getDataFromServer();
		} else { //if success is false
			var errorMessage = response.errors;
			console.log(errorMessage)
		}
	}
	handleError() {
		console.log('Server Request Failed!')
	}


}