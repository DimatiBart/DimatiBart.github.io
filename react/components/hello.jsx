import React from 'react';
import classNames from 'classnames';
import "./hello.less";

export class Clock extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            date: this.getTime(),
            isTicking: false,
            buttonMsg: ''
        };
        this.handleClick = this.handleClick.bind(this);
    }
    getTime(){
        return (new Date()).toLocaleString('en-GB').match(/\d{2}:\d{2}:\d{2}/)[0];
    }
    render() {
        var classes = classNames('clock', {
            'started': this.state.isTicking,
            'stopped': !this.state.isTicking,
            'hz': this.state.hz
        });

        return (<div className={classes}>
                    <h1>Time is  {this.getTime()}</h1>
                    <button onClick={this.handleClick}>
                        {this.state.buttonMsg}
                    </button>
                </div>)
    }
    componentDidMount(){
        this.startClock();
    }
    componentWillUnmount() {
        this.stopClock();
    }
    startClock(){
        this.timerId = setInterval(
            () => this.tick(),
            1000
        );
        this.setState({
            isTicking: true,
            buttonMsg: this.props.turnOffMsg
        })
    }
    stopClock(){
        clearInterval(this.timerId);
        this.setState({
            isTicking: false,
            buttonMsg: this.props.turnOnMsg
        })
    }
    tick(){
        this.setState({
            date: this.getTime()
        });
    }
    handleClick(){
        if (this.state.isTicking) {
            this.stopClock();
        }
        else {
            this.startClock();
        }
    }
}