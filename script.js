const gamesList = [
	{
		title: "Uncharted2",
		year: 2009,
		imageUrl: "https://wallpapercave.com/wp/wp1826978.jpg",
		id: 1,
	},
	{
		title: "Super Smash Bros Ultimate",
		year: 2018,
		imageUrl: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_CA/games/switch/s/super-smash-bros-ultimate-switch/hero",
		id: 2,
	},
	{
		title: "Elden Ring",
		year: 2022,
		imageUrl: "https://pic.clubic.com/v1/images/1934271/raw?fit=smartCrop&width=1200&height=675&hash=e7519a9577a2b7291fa26880bb22bed6740836be",
		id: 3,
	},
	{
		title: "Marvel Rivals",
		year: 2024,
		imageUrl: "https://4kwallpapers.com/images/wallpapers/marvel-rivals-1920x1080-16086.jpeg",
		id: 4,
	},
	{
		title: "Dragon Quest VI",
		year: 2004,
		imageUrl: "https://m.media-amazon.com/images/I/91JUgxOqpkL.jpg",
		id: 5,
	},
	{
		title: "Metroid Dread",
		year: 2021,
		imageUrl: "https://sirus.b-cdn.net/wp-content/uploads/2021/10/Metroid-Dread-Gallery-6.jpg",
		id: 6,
	},
  ];
  
  // Fonction pour insérer des cartes dynamiques
  function writeDom() {
	const gameContainer = document.querySelector('.row');
	gamesList.forEach((game) => {
		const card = `
			<article class="col">
				<div class="card shadow-sm">
					<img src="${game.imageUrl}" class="card-img-top" alt="${game.title}" />
					<div class="card-body">
						<h5 class="card-title">${game.title}</h5>
						<p class="card-text">Released in ${game.year}.</p>
						<div class="d-flex justify-content-between align-items-center">
							<div class="btn-group">
								<button 
									type="button" 
									class="btn btn-sm btn-outline-secondary view" 
									data-bs-toggle="modal" 
									data-bs-target="#exampleModal" 
									data-edit-id="${game.id}">
									View
								</button>
								<button 
									type="button" 
									class="btn btn-sm btn-outline-secondary edit" 
									data-bs-toggle="modal" 
									data-bs-target="#exampleModal" 
									data-edit-id="${game.id}">
									Edit
								</button>
							</div>
						</div>
					</div>
				</div>
			</article>
		`;
		gameContainer.innerHTML += card;
	});
  
	// Ajouter les événements aux boutons "view" et "edit"
	const editButtons = document.querySelectorAll(".edit");
	editButtons.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const gameId = e.target.getAttribute("data-edit-id");
			editModal(gameId);
		});
	});
  
	const viewButtons = document.querySelectorAll(".view");
	viewButtons.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const gameId = e.target.getAttribute("data-edit-id");
			viewModal(gameId);
		});
	});
  }
  
  // Fonction qui met à jour le modal pour "Edit"
  
  function editModal(gameId) {
	// Trouver le jeu correspondant dans la liste par son ID
	const result = gamesList.find((game) => game.id === parseInt(gameId));
  
	if (result) {
		// Charger le contenu du formulaire depuis form.html
		fetch("./form.html")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to load form.html");
				}
				return response.text(); // Lire le contenu de form.html
			})
			.then((formHtml) => {
				// Modifier le modal avec le titre et le formulaire récupéré
				modifyModal("Edit Mode", formHtml);
  
				// Pré-remplir les champs du formulaire avec les données du jeu
				document.querySelector("#gameTitle").value = result.title;
				document.querySelector("#gameYear").value = result.year;
				document.querySelector("#gameImageUrl").value = result.imageUrl;
  
				// Ajouter un seul bouton de soumission dans le pied de page du modal
				const footer = document.querySelector(".modal-footer");
				footer.innerHTML = `
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
						Close
					</button>
					<button type="submit" class="btn btn-primary" id="saveChangesButton">Submit</button>
				`;
  
				// Ajouter un gestionnaire d'événements pour le bouton "Submit"
				document.querySelector("#saveChangesButton").addEventListener("click", (e) => {
					// Récupérer les nouvelles valeurs du formulaire
					const newTitle = document.querySelector("#gameTitle").value;
					const newYear = document.querySelector("#gameYear").value;
					const newImageUrl = document.querySelector("#gameImageUrl").value;
  
					// Mettre à jour le jeu dans la liste
					result.title = newTitle;
					result.year = newYear;
					result.imageUrl = newImageUrl;
  
					// Recharger les cartes après la mise à jour
					const gameContainer = document.querySelector('.row');
					gameContainer.innerHTML = ""; // Réinitialiser le conteneur
					writeDom(); // Réécrire les cartes
  
					// Fermer le modal après avoir sauvegardé les modifications
					const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
					modal.hide();
				});
			})
			.catch((error) => {
				console.error("Error loading the form:", error);
			});
	}
  }
  
  
  // Fonction qui met à jour le modal pour "View"
  function viewModal(gameId) {
	const result = gamesList.find((game) => game.id === parseInt(gameId));
	
	if (result) {
		const modalBody = `<img src="${result.imageUrl}" alt="${result.title}" class="img-fluid" />`;
		modifyModal(result.title, modalBody);
		
		// Modifier le footer
		document.querySelector(".modal-footer").innerHTML = `
			<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
				Close
			</button>
		`;
	} else {
		console.error("Game not found");
	}
  }
  
  function updateGames(title, year, imageUrl, gameId) {
	const index = gamesList.findIndex((game) => game.id === parseInt(gameId));
	
	if (index !== -1) {
		gamesList[index].title = title;
		gamesList[index].year = year;
		gamesList[index].imageUrl = imageUrl;
		
		document.querySelector(".row").innerHTML = ""; // Réinitialiser les cartes dans le DOM
		writeDom(); // Réécrire les cartes
		
		// Réajuster les événements sur les boutons après la mise à jour
		const editButtons = document.querySelectorAll(".edit");
		editButtons.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				editModal(e.target.getAttribute("data-edit-id"));
			});
		});
  
		const viewButtons = document.querySelectorAll(".view");
		viewButtons.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				viewModal(e.target.getAttribute("data-edit-id"));
			});
		});
	} else {
		console.error("Game not found");
	}
  }
  
  // Fonction pour modifier le contenu du modal
  function modifyModal(modalTitle, modalBody) {
	// Écrire le nom du jeu dans le titre du modal
	document.querySelector(".modal-title").textContent = modalTitle;
	// Écrire dans le corps du modal
	document.querySelector(".modal-body").innerHTML = modalBody;
  }
  
  // Appel de la fonction d'écriture au chargement du DOM
  document.addEventListener('DOMContentLoaded', writeDom);