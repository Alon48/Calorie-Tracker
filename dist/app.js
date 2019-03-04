// Storage Controller


//Item Controller
const ItemCtrl = (function(){

// Item Contstructor
const Item = function(id,name,calories){
  this.id =id;
  this.name = name;
  this.calories = calories;
}
  //Data Structure / State
  const data = {
    items: [
    //  {id: 0, name: "Steak Dinner", calories: 600},
    //  {id: 1, name: "Cookie", calories: 400},
    //  {id:2, name: "Eggs", calories: 300}
    ],
    currentItem: null, //when we update we want selected item
    totalCalories: 0
  }

  //Public Methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name,calories) {
      let id;
      //create ID
      if(data.items.length > 0) {
          id = data.items[data.items.length -1].id + 1;
      } else {
        id = 0;
      }

      //calories to number
       calories = parseInt(calories);

       //create new Item
       newItem = new Item(id, name, calories);

       //add to items array
       data.items.push(newItem);

       return newItem;
    }, 

    getItemById: function(id){
        let found = null;
        //loop through items
        data.items.forEach(function(item){
          if(item.id === id){
            found = item;
          }
          
        });
        return found;
    },

    updateItem: function(name, calories) {
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }

        

      });

      return found;
    },

    deleteItem: function(id) {
      //get ids
      const ids = data.items.map(function(item){
        return item.id
      });

      //get index
      const index = ids.indexOf(id);

      //remove item
      data.items.splice(index, 1);
    },

    clearItemsData: function() {
      data.items = [];
    },

    setCurrentItem: function(item){
        data.currentItem = item;
    },

    getCurrentItem: function() {
      return data.currentItem;
    
    },

    getTotalCalories: function() {
        let total = 0;

        data.items.forEach(function(item){
          //add all calories in the list together
          total += item.calories;
          
        });

        //set total calories in the data structure
      data.totalCalories = total;

      //return total
      return data.totalCalories;
    },

    logData: function() {
      return data;
    }
  }
})();



//***UI Controller***//
//**************** *//

const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories : '.total-calories'
  }

  //Public methods
  return {

    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
          </a>
          </li>`;
      });

      //insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function() {
      return{
          name: document.querySelector(UISelectors.itemNameInput).value,
          calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item) {
        //create li element
        const li = document.createElement('li');
        // add class
        li.className = 'collection-item';
        // add id
        li.id = `item-${item.id}`;
        //add html
        li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
          </a>`;
        //insert item
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn node list into an array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML =`<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>` ;
        }
      });
    },

    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value ='';
      document.querySelector(UISelectors.itemCaloriesInput).value='';
    },

    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value =ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    removeAllItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn list nodes into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){

        item.remove();
      });
    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent= totalCalories;
    },

    clearEditState: function() {
        UICtrl.clearInput();
        document.querySelector(UISelectors.updateBtn).style.display = 'none';
        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(UISelectors.backBtn).style.display = 'none';
        document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
  },

    
    getSelectors: function() {
        return UISelectors;
    },
    

  }

})();




//***App Controller****//
//****************** *//

const AppCtrl = (function(ItemCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function() {
      //get UI selectors
      const UISelectors = UICtrl.getSelectors();

      //add item event
      document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

      //disable enter to submit
      document.addEventListener('keypress', function(e){
        if(e.keyCode === 13 || e.which === 13) {
          e.preventDefault();
          return false;
        }
      })
      
      // Edit icon click event for food list
      document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

      // Update item event
      document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

      //back button event
      document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);

      //delete item event
      document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        //clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItems);

    }

    // Add item submission
    const itemAddSubmit = function(e) {
          //get form input from UI controller
      const input = UICtrl.getItemInput();
      
      //Check that both name and calorie input
      if(input.name !== '' && input.calories!== '') {
        //add item to 
        const newItem = ItemCtrl.addItem(input.name, input.calories);
        //add item to UI list
        UICtrl.addListItem(newItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);
        //clear fields
        UICtrl.clearInput();
      } //add else statement later
     
      e.preventDefault();

    }

    //click edit item
    const itemEditClick = function(e) {

      if(e.target.classList.contains('edit-item')) {
        //get list item ID
        const listID = e.target.parentNode.parentNode.id;
        
        
        // Break into an array
        const listIdArr = listID.split('-');

       //get actual item ID
       const id = parseInt(listIdArr[1]);

       //get item
       const itemToEdit = ItemCtrl.getItemById(id);

       //set current Item
       ItemCtrl.setCurrentItem(itemToEdit);

       //add item to form
       UICtrl.addItemToForm();
      }

      e.preventDefault();
    }

    //item update submit
    const itemUpdateSubmit = function(e) {
     
      //get item input
      const input = UICtrl.getItemInput();

      //update item in data structure
      const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

      //update UI
      UICtrl.updateListItem(updatedItem);

      //get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      UICtrl.clearEditState();

      e.preventDefault();
    }

    //delete button event
    const itemDeleteSubmit = function(e) {
      //get current item
      const currentItem = ItemCtrl.getCurrentItem();

      //delete from data structure
      ItemCtrl.deleteItem(currentItem.id);

      //delete from UI
      UICtrl.deleteListItem(currentItem.id);

       //get total calories
       const totalCalories = ItemCtrl.getTotalCalories();
       //add total calories to the UI
       UICtrl.showTotalCalories(totalCalories);
 
       UICtrl.clearEditState();

      e.preventDefault();
    }

    const clearAllItems = function() {
        //get all items
      //delete all items from data structure
      ItemCtrl.clearItemsData();

         //get total calories
         const totalCalories = ItemCtrl.getTotalCalories();
         //add total calories to the UI
         UICtrl.showTotalCalories(totalCalories);

      //remove from UI
      UICtrl.removeAllItems();

      //hide UL
      //**something should go here? */

    
    }

    //public methods
  return {
    init: function() {
      //Clear edit state 
      UICtrl.clearEditState();
      console.log('INITIALIZING APP...')

      //get items from data structure
      const items = ItemCtrl.getItems();
      
      // Populate list with items
      UICtrl.populateItemList(items);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

      //Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl,UICtrl);


//Initialize App
AppCtrl.init();