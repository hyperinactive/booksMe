$(document).ready(() => {
	console.log('Something');

	$('.deletion-btn').on('click', (e) => {

		if (e.target.innerHTML === 'You sure?') {
			console.log('Yeah, I\'m sure');

			// create the url for the deletion route
			const location = window.location.href;
      const tmp = location.split('/');
			const url = tmp[0] + '//' + tmp[2] + '/reviews/' + e.target.parentElement.getAttribute('name');
			// console.log(e.target.parentElement.getAttribute('name'));
			// console.log(url);

			fetch(url, {
				method: 'DELETE',
			}).then((response) => response.json()).then(data => {
				if (data) {
					console.log(data);
					e.target.parentElement.remove();
				}
			})
			
		} else {
			console.log('You want to delete me, I knew it');
		$(e.target).html('You sure?');
		
		e.target.parentElement.children[4].style.display = 'inline-block';
		e.target.parentElement.children[5].style.display = 'none';
		}
		
	});

	$('.cancel-btn').on('click', (e) => {
		console.log('Nah, dawg, jk');
		e.target.style.display = 'none';
		e.target.parentElement.children[3].innerHTML = "Delete";
		e.target.parentElement.children[5].style.display = 'inline-block';
	});

	$('.update-btn').on('click', (e) => {
		console.log('You want to update me, I knew it');
		console.log(e.target.name + ' says: Why don\'t you like me?');
	});
});