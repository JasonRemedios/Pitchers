import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import $ from 'jquery';


 class OptionRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <span><h1><b>{this.props.name}</b> <button className="w3-right w3-btn w3-dark-grey w3-round" onClick={() => this.props.addToCart(this.props.name + ' ' + this.props.item, this.props.price)}>{this.props.price}</button></h1>
        <p></p></span>
      );
  }
}

class CartRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      button: false,
      showFull: true,
      name: this.props.name
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {button: props.button };
  }

  componentDidUpdate() {
    var cartHeight = $('#cart').height();
    document.getElementById("minimize").style.bottom = ((cartHeight - 2).toString()) + 'px';
    if (!this.state.showFull) {
      if ($('#C' + this.props.index).height() > 60) {
        this.setState({name: this.state.name.slice(0, this.state.name.length - 1)});
      }
    }
  }

  componentDidMount() {
    let height = $('#C' + this.props.index).height()
    if (height > 50) {
      this.setState({showFull: false, name: this.props.name.slice(0, this.props.name.length - 1)});
    }
  }

  render () {
    var name;
    let buttonHTML = (
      <button>{this.props.price}</button>
    );
    
    //name = (this.props.name.length > 12) ? this.props.name.slice(0, 9) + '...' : this.props.name;
    return (
        <div id={'C' + this.props.index} className='w3-cell-row w3-display-container'>
          <div onClick={() => this.setState({showFull: !(this.state.showFull)})} style={{width: '85%'}}>{this.state.showFull ? this.props.name : this.state.name + '...'}</div>
          <div className='w3-container w3-cell w3-display-container' style={{width: "15%", position: 'relative', right: '-15px'}}><span className='w3-display-bottomright'>{this.state.button ? buttonHTML : this.props.price}</span></div>
          <div id='removeFromCartContainer' className='w3-container w3-cell w3-display-container' style={{width: "54px", fontSize: '36px'}}><button id='removeFromCart' className='w3-button w3-display-bottomright' onClick={() => this.props.removeFromCart(this.props.name)}>&times;</button></div>
         </div>
      );
  }
}

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: null,
      minimized: false,
      checkout : false,
      paymentOption: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {cart: props.cart}
  }

  minimize = () => {
    this.setState({minimized: true});
  }

  maximize = () => {
    this.setState({minimized: false});
  }

  checkout = () => {
    this.setState({checkout: true});
  }

  closeCheckout = () => {
  var modal = document.getElementById('id02');
    modal.style.display = "none";
    this.setState({checkout: false});
  }

  choosePaymentOption = (option) => {
    this.setState({checkout: false, paymentOption: option});
  }

  componentDidUpdate() {
    if (this.state.checkout) {
      document.getElementById('id02').style.display='block';
 //     document.getElementById('name').focus();
    }
    if (this.state.paymentOption !== null) {
      document.getElementById('id03').style.display='block';
    }
    if (this.state.minimized) {
        document.getElementById('max').style.bottom = '0px';
    } else {
        var cartHeight = $('#cart').height();
        document.getElementById("minimize").style.bottom = ((cartHeight - 2).toString()) + 'px';
        var margin = $('#removeFromCartContainer').outerWidth() - 15 + 'px';
        $('#total').css('margin-right', margin);
    }
  }
  
  componentDidMount() {
      //var parentwidth = $("#content").width();      
      //$("#cart").width(parentwidth);
      var cartHeight = $('#cart').height();
      document.getElementById("minimize").style.bottom = ((cartHeight - 2).toString()) + 'px';
      if (this.state.minimized === false) {
        var margin = $('#removeFromCartContainer').outerWidth() - 15 + 'px';
        $('#total').css('margin-right', margin);
      }
  }
 /*<button id='checkoutBtn' className='w3-button w3-small w3-border w3-border-black' style={{padding: '5px'}}>Checkout</button>*/
  render() {
     if (this.state.cart.length > 0) {
      var board = [];
      var priceSum = 0;
      let key = 0;
      let index = 0;
      for (let item of this.state.cart) {
        board.push(<CartRow name={item[0]} price={item[1]} removeFromCart={this.props.removeFromCart} key={key} index={index} />);
        priceSum += Math.round(Number(item[1]) * 100) / 100;
        key += 1;
        index += 1;
      }

      var option = this.state.paymentOption;
      console.log(option);
      var optionHTML;
      if (option !== null) {
        if (option === 'pay here') {
          let arr = [];
          let obj = {};
          for (let item of this.state.cart) {
            arr.push({id: item[0]});
          }
          obj.items = arr;
          obj.price = priceSum;
          console.log(obj.price);
          optionHTML = (
            <div className='w3-container w3-red w3-row w3-black' id='payHere'>
              <div id="id03" className="w3-modal w3-display-container">
                <div id='wholeCheckoutForm' className="w3-mobile w3-display-container w3-row w3-col m5 l5 w3-border w3-border-black w3-red w3-display-middle w3-container">
               
                  <header id='ho' className="w3-container w3-red">
              <span onClick={() => this.setState({paymentOption: null})} className="w3-button w3-display-topright">&times;</span>
              <br></br>
            </header>
               
               {<App items={obj} />}
               
              
                    
                </div>
              </div>
            </div>
            );
        } else if (option === 'pay at store') {
          optionHTML = (
            <div className='w3-container w3-red w3-row w3-black' id='payAtStore'>
              <div id="id03" className="w3-modal w3-display-container">
                <div id='wholeCheckoutForm' className="w3-mobile w3-display-container w3-row w3-col m5 l5 w3-border w3-border-black w3-red w3-display-middle w3-container">
            <div className='w3-container w3-center' style={{fontSize: 'x-large'}}>
              <button className='w3-button' style={{width: '50%', padding: '15px'}}>Log in</button>
              <button className='w3-button' style={{width: '50%', padding: '15px'}}>Sign up</button>  
                </div>
                </div>
               </div>
             </div>
          );
        }
      }
      if (this.state.minimized) {
          
          var minimizedCartHTML = (
          <div id='cart' style={{width: this.props.width}}>
            <span id='max' className='w3-red w3-border-right w3-border-left w3-border-top w3-border-black' style={{padding: '0 32px', fontSize: '27px'}} onClick={() => this.maximize()}><span className='w3-display-middle'>({board.length})</span></span>
          </div>
          );
      } else {
        
        var maximizedCartHTML =  (
        <div id='cart' style={{width: this.props.width}}>
        <span id='minimize' className='w3-red w3-border-left w3-border-top w3-border-right w3-border-black' onClick={() => this.minimize()}>&minus;</span> 
            
          <div id='items' className='w3-red'>
            {board}
            <hr id='cartDivider'></hr>
            <div id='cartBottom' className='w3-cell-row' style={{height: '50%'}}>
              <button className='w3-button w3-border w3-border-black' style={{marginBottom: '5px', fontSize: '20px', padding: '6px 12px'}} onClick={() => this.checkout()}>Checkout</button>
              <div className='w3-container w3-cell w3-right-align' style={{paddingRight: '0', fontSize: '25px'}}><span id='total'>{priceSum.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        
       
        );

        if (this.state.checkout) {
        /*var checkoutHTML = (
          <div className='w3-container w3-red w3-row w3-black' id='checkout'>
            <div id="id02" className="w3-modal w3-display-container">
              <div className="w3-mobile w3-display-container w3-row w3-col s12 m8 l8 w3-border w3-border-black w3-red w3-display-middle w3-container">
              
            <header id='ho' className="w3-container w3-red">
              <span onClick={() => this.setState({checkout: false})} className="w3-button w3-display-topright">&times;</span>
              <br></br>
            </header>
               <div className='w3-display-middle w3-center'><span id='checkoutForm'>Name:<input id='name'></input></span></div><br></br>
               
               
              <p className='w3-display-container'>
                    <button id='checkoutBtn' className='w3-display-middle w3-button w3-small w3-border w3-border-black' style={{padding: '5px'}}>Checkout</button>
              </p>
              </div>
            </div>
          </div>
        );*/   

        /*<header id='ho' className="w3-container w3-red">
                  <span onClick={() => this.setState({checkout: false})} className="w3-button w3-display-topright">&times;</span>
                </header> */

        var checkoutHTML = (
          <div className='w3-container w3-red w3-row w3-black' id='checkout'>
            <div id="id02" onClick={() => this.closeCheckout()} className="w3-modal w3-display-container">
              <div className="w3-mobile w3-display-container w3-row w3-col m5 l5 w3-border w3-border-black w3-red w3-display-middle w3-container">
             
                <div className='w3-container w3-center' style={{fontSize: 'x-large'}}>
                  <button onClick={() => this.choosePaymentOption('pay at store')} className='w3-button w3-display-container' style={{width: '50%', padding: '15px', height: '51px'}}>
                  <span className='w3-display-topmiddle'>Pay at store</span>
                  <span className='w3-medium w3-display-bottommiddle'>(requires account)</span></button>
                  <button onClick={() => this.choosePaymentOption('pay here')} className='w3-button' style={{width: '50%', padding: '15px'}}>Pay here</button>

                </div>
              </div>
            </div>
          </div>
          );
      }
      }
    }


    return(
    <div style={{maxWidth: 'inherit', width: 'inherit'}}>
      {this.state.checkout ? checkoutHTML : null}
      {this.state.paymentOption ? optionHTML : null}
      {this.state.minimized ? minimizedCartHTML : maximizedCartHTML}
    </div>
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      options: null
    }
  } 

  componentDidMount() {
    document.getElementById("myLink").click();
  }

  removeFromCart = (name) => {
    let array = this.state.cart;
    for (let item in array) {
      if (array[item][0] === name) {
        array.splice(item, 1);
        this.setState({cart: array});
        break;
      }
    }
  }

  addToCart = (name, price) => {
    let array = this.state.cart;
    array.push([name, price]);
    this.setState({cart: array, options: null});
  }

  getOptions = (name, object) => {
    if (typeof object === 'object') {
      let obj = {name: name, object: object}
      this.setState({options: obj});
    } else {
      this.addToCart(name, object);
    }
  }

  componentDidUpdate() {
    if (this.state.options) {
      document.getElementById('id01').style.display='block';
    }
    /*var windowWidth = ($(window).width() - 2) + 'px';
    console.log(windowWidth);
    console.log($('#options').width());
    $('#options').width(windowWidth);
    console.log($('#options').width());*/
    console.log($('#removeFromCartContainer').outerWidth());
    
    
  }

  showOptions = () => {
    let board = [];
    for (let option in this.state.options.object) {
      board.push(<OptionRow name={option} price={this.state.options.object[option]} addToCart={this.addToCart} item={this.state.options.name} />);
      board.push(<hr className='w3-pink'></hr>);
    }
    board.pop();
    var windowWidth = ($(window).width()) + 'px';
    
    
    return (
      <div className='w3-container w3-black' id='option'>
        <div id="id01" className="w3-modal w3-display-container">
          <div id='options' style={{border: '3px solid black'}} className="w3-mobile w3-display-middle">
          
            <header id='h' style={{position: 'relative', top: '1px'}} className="w3-container w3-red">
              <span onClick={() => this.setState({options: null})} className="w3-button w3-display-topright">&times;</span>
              <br></br>
            </header>
            <div className="w3-container w3-red" style={{padding: '0.01em 28px'}}>
              {board}
            </div>
          </div>
        </div>
      </div>
    );
  }

   minimize = () => {
    console.log('hello');
  }

  render () {
    if (this.state.cart.length > 0) {
      let board = [];
      let priceSum = 0;
      for (let item of this.state.cart) {
        board.push(<CartRow name={item[0]} price={item[1]} removeFromCart={this.removeFromCart} />);
        priceSum += item[1];
      }
      var cartHTML = (
      <div id='cart'>
            <span id='minimize' className='w3-red w3-border-right w3-border-left w3-border-top w3-border-black' onClick={() => this.minimize()}>&minus;</span>
          <div id='items' className='w3-container w3-red w3-border w3-border-black'>
            {board}
            <hr></hr>
            <div className='w3-cell-row' style={{height: '50%'}}>
              <div className='w3-container w3-cell'></div>
              <div className='w3-container w3-cell' style={{width: "10%"}}>{priceSum}</div>
              <div className='w3-container w3-cell' style={{width: "10%"}}></div>
            </div>
          </div>
        </div>
      
    );
  }

  var contentWidth = $("#content").width();

  var sectionBoard = [];
  for (let section in menu) {
    sectionBoard.push(<MenuSection name={section} getOptions={this.getOptions} addToCart={this.addToCart} />)
  }

    return (
      <div className="w3-container w3-black w3-padding-64 w3-xxlarge">
      <div id="menu">

      
        {this.state.options ? this.showOptions() : null}

  <div id='content' className="w3-content">
  
  <div style={{maxWidth: 'inherit'}}>
      {cartHTML ? <Cart cart={this.state.cart} removeFromCart={this.removeFromCart} width={contentWidth} /> : null}
    </div>
  
    <h1 className="w3-center w3-jumbo w3-padding-32" >THE MENU</h1>
    <div className="w3-row w3-center w3-border w3-border-dark-grey">
      <a href="javascript:void(0);" onClick={(event) => openMenu(event, 'Seafood')} id="myLink">
        <div style={{padding: '12px 0px'}} className="w3-col s4 tablink w3-xlarge w3-hover-red">Seafood</div>
      </a>
      <a href="javascript:void(0);" onClick={(event) => openMenu(event, 'Pizza')}>
        <div style={{padding: '12px 0px'}} className="w3-col s4 tablink w3-xlarge w3-hover-red">Pizza</div>
      </a>
      <a href="javascript:void(0);" onClick={(event) => openMenu(event, 'Chicken')}>
        <div style={{padding: '12px 0px'}} className="w3-col s4 tablink w3-xlarge w3-hover-red">Chicken</div>
      </a>
    </div>

    {sectionBoard}

    {/* <div id="Pizza" className="w3-container menu w3-padding-32 w3-white">
      <h1><b>Margherita</b> <span className="w3-right w3-tag w3-dark-grey w3-round">$12.50</span></h1>
      <p className="w3-text-grey">Fresh tomatoes, fresh mozzarella, fresh basil</p>
      <hr></hr>
   
      <h1><b>Fish & Chips</b> <button className="w3-right w3-btn w3-dark-grey w3-round" onClick={() => this.getOptions(menu['From the Sea']['Fish & Chips'])}>$8.99</button></h1>
      <p className="w3-text-grey">Four cheeses (mozzarella, parmesan, pecorino, jarlsberg)</p>
      <hr></hr>
      
      <h1><b>Chicken</b> <span className="w3-right w3-tag w3-dark-grey w3-round">$17.00</span></h1>
      <p className="w3-text-grey">Fresh tomatoes, mozzarella, chicken, onions</p>
      <hr></hr>

      <h1><b>Pineapple'o'clock</b> <span className="w3-right w3-tag w3-dark-grey w3-round">$16.50</span></h1>
      <p className="w3-text-grey">Fresh tomatoes, mozzarella, fresh pineapple, bacon, fresh basil</p>
      <hr></hr>

      <h1><b>Meat Town</b> <span className="w3-tag w3-red w3-round">Hot!</span><span className="w3-right w3-tag w3-dark-grey w3-round">$20.00</span></h1>
      <p className="w3-text-grey">Fresh tomatoes, mozzarella, hot pepporoni, hot sausage, beef, chicken</p>
      <hr></hr>

      <h1><b>Parma</b> <span className="w3-tag w3-grey w3-round">New</span><span className="w3-right w3-tag w3-dark-grey w3-round">$21.50</span></h1>
      <p className="w3-text-grey">Fresh tomatoes, mozzarella, parma, bacon, fresh arugula</p>
    </div>

    <div id="Pasta" className="w3-container menu w3-padding-32 w3-white">
      <h1><b>Lasagna</b> <span className="w3-tag w3-grey w3-round">Popular</span> <span className="w3-right w3-tag w3-dark-grey w3-round">$13.50</span></h1>
      <p className="w3-text-grey">Special sauce, mozzarella, parmesan, ground beef</p>
      <hr></hr>
   
      <h1><b>Ravioli</b> <span className="w3-right w3-tag w3-dark-grey w3-round">$14.50</span></h1>
      <p className="w3-text-grey">Ravioli filled with cheese</p>
      <hr></hr>
      
      <h1><b>Spaghetti Classica</b> <span className="w3-right w3-tag w3-dark-grey w3-round">$11.00</span></h1>
      <p className="w3-text-grey">Fresh tomatoes, onions, ground beef</p>
      <hr></hr>

      <h1><b>Seafood pasta</b> <span className="w3-right w3-tag w3-dark-grey w3-round">$25.50</span></h1>
      <p className="w3-text-grey">Salmon, shrimp, lobster, garlic</p>
    </div>


    <div id="Starter" className="w3-container menu w3-padding-32 w3-white">
      <h1><b>Today's Soup</b> <span className="w3-tag w3-grey w3-round">Seasonal</span><span className="w3-right w3-tag w3-dark-grey w3-round">$5.50</span></h1>
      <p className="w3-text-grey">Ask the waiter</p>
      <hr></hr>
   
      <h1><b>Bruschetta</b> <span className="w3-right w3-tag w3-dark-grey w3-round">$8.50</span></h1>
      <p className="w3-text-grey">Bread with pesto, tomatoes, onion, garlic</p>
      <hr></hr>
      
      <h1><b>Garlic bread</b> <span className="w3-right w3-tag w3-dark-grey w3-round">$9.50</span></h1>
      <p className="w3-text-grey">Grilled ciabatta, garlic butter, onions</p>
      <hr></hr>
      
      <h1><b>Tomozzarella</b> <span className="w3-right w3-tag w3-dark-grey w3-round">$10.50</span></h1>
      <p className="w3-text-grey">Tomatoes and mozzarella</p>
    </div>*/}<br></br> 

    </div>
  </div>
</div>
      );
  }
}

class MenuSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let itemBoard = [];
    let price;
    let section = menu[this.props.name];
    let itemDetails;
    let click;
    for (let item in section) {
      itemDetails = section[item];
      price = itemDetails[1];
      if (typeof price === 'object') {
        price = price[Object.keys(price)[0]];
      }
      itemBoard.push(<MenuItem name={item} price={price} getOptions={this.props.getOptions} menuLocation={itemDetails} />);
      itemBoard.push(<hr></hr>);
    }
    itemBoard.pop();
    return(
      <div id={this.props.name} className='menu'>
      <img src={this.props.name + '.png'} style={{width: '100%'}}></img>
        <div className="w3-container w3-padding-32 w3-white">

          {itemBoard}
        </div>
        </div>
      );
  }
}

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let menuLocation = this.props.menuLocation;
    let name = this.props.name;
    return(
        <span>
          <h1><button onClick={() => this.props.getOptions(name, menuLocation[1])} className="w3-right w3-btn w3-dark-grey w3-round">${this.props.price}</button><b>{name}</b> </h1>
          <p style={{fontSize: '30px'}} className="w3-text-grey">{menuLocation[0]}</p>
        </span>
      );
  }
}
function openMenu(evt, menuName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("menu");
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
     tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
  }
  document.getElementById(menuName).style.display = "block";
  evt.currentTarget.firstElementChild.className += " w3-red";
}


const menu = {
  Pizza: {
    Cheese: [
        '', 
        {
          '10in.': 7.99,
          '14in.': 10.99,
          '16in.': 13.99
        }
    ],
    Regular: [
        'Pepperoni, salami & cheese',
        {
          '10in.': 9.99,
          '14in.': 13.99,
          '16in.': 15.99
        } 
    ],
    'Hawaiian' : [
        null,
        {
         '10in.': 12.99,
         '14in.': 14.99,
         '16in.': 17.99 
        }
    ],
    Deluxe: [
        'Pepperoni, salami, mushrooms, green pepper, onion, pineapple & cheese',
        {
          '10in.': 13.99,
          '14in.': 15.99,
          '16in.': 18.99
        }
    ],
    'Meat lovers' : [
        'Pepperoni, salami, bacon, sausage, beef & cheese',
        {
          '10in.': 14.99,
          '14in.': 19.99,
          '16in.': 23.99
        }
    ],
    'Garlic fingers' : [
      null,
      {
          '10in.': '8.00',
          '14in.': 12.99,
          '16in.': 14.99
      }
    ]
  },
  Chicken: {
    'Breast & Fries': [
      null,
      8.39
    ],
    'Thigh & Fries': [
      null,
      7.39
    ],
    Snack: [
      '2pc & Fries',
      8.99
    ],
    Dinner: [
      '3pc & Fries',
      11.99
    ],
    'Wings & Fries' : [
      null,
      {
        '3pc': 9.49,
        '5pc': 13.69
      }
    ],
    'Chicken only' : [
      null,
      {
        '8pc': 21.99,
        '12pc': 29.99,
      }
    ],
    'Finger & Fries (3)' : [
      null,
      9.49
    ],
    'Nuggets & Fries (6)' : [
      null,
      7.99
    ],
    'Zinger Wings & Fries (6)' : [
      null,
      9.99
    ]
  },
  Seafood: {
    'Fish & Chips': [
      null,
      {
        '1pc': 8.99,
        '2pc': 12.99,
        '3pc': 15.99
      }
    ],
    'Seafood Platter': [
      '1pc fish, 3 shrimp, 3 scallops, 3 cod nuggets & fries',
      14.29
    ],
    'Cod Nuggets & Fries' : [
      null,
      9.49
    ],
    'Scallops or Shrimp & Fries' : [
      null,
      10.99
    ],
    'Land & Sea' : [
      null,
      12.99
    ]
  }
};

ReactDOM.render(<Main />, document.getElementById('root'));