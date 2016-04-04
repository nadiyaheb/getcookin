$(document).ready(function(){
var fireb = new Firebase("https://getcookin.firebaseio.com");


$("#addToPantry").submit(function(e){
	e.preventDefault();
	var $foodItem = $(this).find('input[name="foodItem"]');
	console.log($foodItem.val());

	fireb.child("foodItem").push({
		name:$foodItem.val(),
		amount: 1,

	})	

	$foodItem.val("");
})

function getPantry(){
	fireb.child("foodItem").on('value', function(results){
		$("#pantryInventory").empty();
		var values = results.val();
	
		for(var key in values){
			console.log(values[key]);
			var food = values[key];
			var deleteBtn = $('<a href="#">Delete</a>').data("id",key);
			var foodListItem = $("<li>"+ food.name + " </li>");
			foodListItem.append(deleteBtn);
			$("#pantryInventory").append(foodListItem);


			deleteBtn.click(function(){
				var food = $(this).data("id");
				console.log(food);
				
				removeFoodItem(food);
			})

		}
	})
		

}

	function removeFoodItem(food){
		var ref = fireb.child('foodItem').child(food);
		ref.remove();
	}

getPantry();


})