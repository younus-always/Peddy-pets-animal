const menuBar = document.getElementById("menu-bar");
const menuList = document.getElementById("menu-list");
menuBar.addEventListener("click", () => {
    menuList.classList.toggle("hidden");
});

//******** Load All Category ********
const loadCategory = async () => {
    const res = await fetch(
        "https://openapi.programming-hero.com/api/peddy/categories"
    );
    const data = await res.json();
    displayCategory(data.categories);
};

//******** Load All Pets ********
const loadAllPets = async () => {
    const res = await fetch(
        "https://openapi.programming-hero.com/api/peddy/pets"
    );
    const data = await res.json();
    displayAllPets(data.pets);
};

//****** Display All Category *******
const displayCategory = (categories) => {
    categories.forEach((category) => {
        const categoryContainer = document.getElementById("category-container");
        const div = document.createElement("div");
        div.innerHTML = `
        <div id="btn-${category.id}" onclick="categoryBtn('${category.category}')" class="category-btn flex items-center justify-center gap-4 border border-gray-300 py-4 rounded-full cursor-pointer hover:border-gray-400">
                    <img src="${category.category_icon}" class="w-14" alt="">
                    <h4 class="font-bold text-2xl">${category.category}</h4>
                </div>`;
        categoryContainer.append(div);
    });
};

// ******* Display All Pets *******
const displayAllPets = (pets) => {
    // console.log(pets)
    const petsContainer = document.getElementById("pets-container");
    const petCardContainer = document.getElementById("pet-card-container");
    petsContainer.innerHTML = "";
    petCardContainer.classList.remove("xl:flex-row");
    const lodePet = document.getElementById("loaderPet");
    lodePet.classList.remove("hidden");
    setTimeout(() => {
        lodePet.classList.add("hidden");
        petCardContainer.classList.add("xl:flex-row");
        if (pets.length == 0) {
            petsContainer.classList.remove("grid");
            petsContainer.classList.add("border", "p-3", "rounded-lg");
            petsContainer.innerHTML = `
            <div class="flex items-center justify-center flex-col rounded-lg bg-gray-200 p-5">
                <img src="../images/error.webp" alt="error-no-data"/>
                <h3 class="font-bold text-3xl text-center my-3">No Information Availabe</h3>
                <p class="text-center mb-2">It is a long established fact that a reader will be distracted by the readable content of a page when looking at 
its layout. The point of using Lorem Ipsum is that it has a.</p>
            </div>
            `;
        } else {
            petsContainer.classList.remove("border", "p-3");
            petsContainer.classList.add("grid");
        }
        pets.forEach((pet) => {
            const { petId, breed, date_of_birth, price, image, gender, pet_name } =
                pet;
            const petCard = document.createElement("div");
            petCard.innerHTML = `
            <div class="p-5 rounded-lg border border-gray-400">
                            <img src="${image}" class="h-60 object-cover border  rounded-lg" alt="">
                            <!-- card body -->
                            <div>
                                <h4 class="font-bold text-xl my-3">${pet_name}</h4>
                                <div class="flex items-center gap-2 mb-2">
                                    <img src="./images/grid.svg" class="w-6" alt="grid-image">
                                    <p>Breed: <span>${breed || "N/A"}</span></p>
                                </div>
    
                                <div class="flex items-center gap-2 mb-2">
                                    <img src="./images/calendar.svg" class="w-6" alt="calendar">
                                    <p>Birth: <span>${date_of_birth || "N/A"
                }</span></p>
                                </div>
    
                                <div class="flex items-center gap-2 mb-2">
                                    <img src="./images/gender-male-female-variant.svg" class="w-6" alt="Gender">
                                    <p>Gender: <span>${gender || "N/A"
                }</span></p>
                                </div>
    
                                <div class="flex items-center gap-2 mb-4">
                                    <img src="./images/currency-usd.svg" class="w-6" alt="currency-usd">
                                    <p>Price: <span>${price ? `${price} $` : "N/A"
                }</span></p>
                                </div>
                            </div>
                            <div class="flex items-center justify-between border-t border-t-gray-400 pt-4">
                                <button onclick="addImage('${image}')" class="border liked rounded-2xl py-2 px-4 hover:bg-gray-300"><img src="./images/thumbs-up.svg" alt="thumbs-up"></button>
                                <button onclick="adoptBtn()" class="disable border font-bold rounded-2xl py-2 px-4 hover:bg-gray-300">Adopt</button>
                                <button onclick="openDetailsModal('${petId}')" class="border font-bold rounded-2xl py-2 px-4 hover:bg-gray-300">Details</button>
                            </div>
    
                        </div>`;
            petsContainer.append(petCard);
        });
    }, 2000);
};

// ******* Category btn click to show this category Pets *********
const categoryBtn = (category) => {
    categoryList(category);
};
const categoryList = async (category) => {
    const res = await fetch(
        `https://openapi.programming-hero.com/api/peddy/category/${category}`
    );
    const data = await res.json();
    displayAllPets(data.data);
};

// ****** sort by price *****
const loadSortPets = async () => {
    const res = await fetch(
        "https://openapi.programming-hero.com/api/peddy/pets"
    );
    const data = await res.json();
    sorted(data.pets);
};

const sortBtn = document.getElementById("sort-btn");
sortBtn.addEventListener("click", () => {
    loadSortPets();
});

const sorted = (pets) => {
    const sortedPets = pets.sort((a,b) => b.price - a.price);
    displayAllPets(sortedPets)
};


// ******* Add image to gallery
const addImage = (addedImage) => {
    const photoGallery = document.getElementById("photo-gallery");
    document.getElementById("gallery-heading").classList.add("mb-2");
    photoGallery.classList.add("mb-2");
    const imageBox = document.createElement("div");
    imageBox.innerHTML = `
    <div class="border overflow-hidden rounded-lg">
                        <img src="${addedImage}" class="" alt="">
                    </div>`;
    photoGallery.appendChild(imageBox);
};

// ******* Adopt Button Disabled & Modal *******
const adoptBtn = () => {
    const adoptDisabled = (count) => {
        if (count) {
            const dialog = document.getElementById("openadopted");
            dialog.showModal();
            let acount = document.getElementById("counting");
            acount.innerText = count;
        } else {
            const dialog = document.getElementById("openadopted");
            dialog.close();
        }
    };
    let count = 4;
    const counting = () => {
        count--;
        if (count < 1) {
            clearInterval(set);
        }
        adoptDisabled(count);
    };
    const set = setInterval(counting, 1000);
};

// ******** Details Modal Popup ******
const openDetailsModal = async (petId) => {
    dialog.showModal();
    const res = await fetch(
        `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
    );
    const data = await res.json();
    const dialogBox = document.getElementById("openDetails");
    const singlePet = data.petData;
    dialogBox.innerText = "";
    const div = document.createElement("div");
    div.classList.add("p-5");
    div.innerHTML = `
                    <div>
                        <img src="${singlePet.image
        }" class="w-full h-max object-cover rounded-xl" alt="pet-image">
                        <h2 class="font-bold text-xl my-2">${singlePet.pet_name
        }</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 mb-2">
                            <div class="flex items-center gap-2 mb-2">
                                <img src="./images/grid.svg" class="w-5" alt="grid-icon">
                                <p>Breed: <span>${singlePet?.breed || "N/A"
        }</span></p>
                            </div>
                            <div class="flex items-center gap-2 mb-2">
                                <img src="./images/calendar.svg" class="w-5" alt="birth-calender-icon">
                                <p>Birth: <span>${singlePet.date_of_birth || "N/A"
        }</span></p>
                            </div>
                            <div class="flex items-center gap-2 mb-2">
                                <img src="./images/gender-male-female-variant.svg" class="w-5" alt="Gender-icon">
                                <p>Gender: <span>${singlePet.gender || "N/A"
        }</span></p>
                            </div>
                            <div class="flex items-center gap-2 mb-2">
                                <img src="./images/currency-usd.svg" class="w-5" alt="currency-usd-icon">
                                <p>Price: <span>${singlePet.price
            ? `${singlePet.price}$`
            : "N/A"
        }</span></p>
                            </div>
                            <div class="flex items-center gap-2 mb-2">
                                <img src="./images/vaccination-icon.svg" class="w-5" alt="vaccination-icon">
                                <p>Vaccinated_status: <span>${singlePet?.vaccinated_status || "N/A"
        }</span></p>
                            </div>
                        </div>
                    </div>
                    <div class="border-t pt-4">
                        <h2 class="font-bold text-xl my-2">Detail Information</h2>
                        <p class="mb-3">${singlePet.pet_details}</p>
                    </div>
                    <button id="close-details" onclick="closeDetailsModal()" class="w-full py-2 font-bold text-slate-50 bg-cyan-500 hover:bg-cyan-600 rounded-2xl mt-2" type="button">
                        Close
                    </button>`;
    dialogBox.append(div);
};

const dialog = document.getElementById("openDetails");
const dialogClose = document.getElementById("close-details");
const closeDetailsModal = () => {
    dialog.close();
};

loadCategory();
loadAllPets();
