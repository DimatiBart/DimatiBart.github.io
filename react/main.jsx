import {Clock} from'./components/hello.jsx';
import ReactDOM from 'react-dom';
import React from 'react';

//
// function formatName(user){
//     return user.firstName + ' ' + user.lastName;
// }
//
// const user = {
//     firstName: 'Harper',
//     lastName: 'Perez'
// };
//
// let element = (
//   <h1>
//       Hello, {formatName(user)}
//   </h1>
// );
//
// ReactDOM.render(
//     element,
//     document.getElementById('root')
// );
//
// function getGreeting(user) {
//     if (user) {
//         return <h1>Hello, {formatName(user)}!</h1>;
//     }
//     return <h1>Hello, Stranger.</h1>;
// }
//
// ReactDOM.render(
//     getTime(),
//     document.getElementById('root')
// );
//
// function getTime(){
//     return <h1>
//         Welcome!
//         {new Date().toLocaleString('UK-GB')}
//         </h1>
// }
//
// function updateView(){
//     ReactDOM.render(
//         getTime(),
//         document.getElementById('root')
//     );
// }
//
// setInterval(updateView, 1000);
//
// function Welcome(props) {
//     return <h1>Hello, {props.name}</h1>;
// }
//
// const element1 = <Welcome name="Sara" />;
// ReactDOM.render(
//     element1,
//     document.getElementById('root')
// );
//
// var element2 = <Hello name="Kacj" />;
//
// ReactDOM.render(
//     element2,
//     document.getElementById('root1')
// );

var msgs = ["Turn off", "Turn on"];

ReactDOM.render(
    <Clock turnOffMsg={msgs[0]} turnOnMsg={msgs[1]}/>,
    document.getElementById('root')
);