import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
const Gamepad = ({ setControllerStatus }) => {
    const [controllerIndex, setControllerIndex] = useState(null);
    const [buttonPressed, setButtonPressed] = useState(false);
    const [gamepadState, setGamepadState] = useState({
        buttons: [],
        axes: []
    });
    const animationFrameRef = useRef();

    const handleConnectDisconnect = useCallback((event, connected) => {
        const gamepad = event.gamepad;
        console.log(gamepad);

        if (connected) {
            setControllerIndex(gamepad.index);
            setGamepadState({
                buttons: Array(gamepad.buttons.length).fill({ value: 0 }),
                axes: Array(gamepad.axes.length).fill(0)
            });
            setControllerStatus(true);
        } else {
            setControllerIndex(null);
            setGamepadState({
                buttons: [],
                axes: []
            });
            setControllerStatus(false);
        }
    }, [setControllerStatus]);

    const updateButtonOnGrid = useCallback((index, value) => {
        const buttonMeter = document.querySelector(`#button-${index} .button-meter`);
        if (buttonMeter) {
            const meterHeight = Number(buttonMeter.dataset.originalYPosition);
            const meterPosition = meterHeight - (meterHeight / 100) * (value * 100);
            buttonMeter.setAttribute("y", meterPosition);
        }
    }, []);

    const updateControllerButton = useCallback((index, value) => {
        const button = document.getElementById(`controller-b${index}`);
        if (button) {
            if (value > 0) {
                button.style.fill = "#777";
                button.style.filter = `contrast(${value * 200}%)`;
            } else {
                button.style.fill = "";
                button.style.filter = "contrast(100%)";
            }
        }
    }, []);

    const updateStick = useCallback((elementId, leftRightAxis, upDownAxis) => {
        const multiplier = 25;
        const stickLeftRight = leftRightAxis * multiplier;
        const stickUpDown = upDownAxis * multiplier;

        const stick = document.getElementById(elementId);
        if (stick) {
            const x = Number(stick.dataset.originalXPosition);
            const y = Number(stick.dataset.originalYPosition);

            stick.setAttribute("cx", x + stickLeftRight);
            stick.setAttribute("cy", y + stickUpDown);
        }
    }, []);

    const handleRumble = useCallback((gamepad) => {
        const rumbleOnButtonPress = document.getElementById("rumble-on-button-press");
        if (rumbleOnButtonPress?.checked && gamepad.vibrationActuator) {
            if (gamepad.buttons.some((button) => button.value > 0)) {
                gamepad.vibrationActuator.playEffect("dual-rumble", {
                    startDelay: 0,
                    duration: 25,
                    weakMagnitude: 1.0,
                    strongMagnitude: 1.0,
                });
            }
        }
    }, []);

    const gameLoop = useCallback(() => {
        if (controllerIndex !== null) {
            const gamepad = navigator.getGamepads()[controllerIndex];
            if (gamepad) {
                gamepad.buttons.forEach((button, i) => {
                    updateButtonOnGrid(i, button.value);
                    updateControllerButton(i, button.value);
                    if (button.value > 0) {
                        setButtonPressed(true);
                    }
                });

                updateStick("controller-b10", gamepad.axes[0], gamepad.axes[1]);
                updateStick("controller-b11", gamepad.axes[2], gamepad.axes[3]);

                setGamepadState({
                    buttons: gamepad.buttons,
                    axes: gamepad.axes
                });

                handleRumble(gamepad);
            }
        }
        animationFrameRef.current = requestAnimationFrame(gameLoop);
    }, [controllerIndex, updateButtonOnGrid, updateControllerButton, updateStick, handleRumble]);

    useEffect(() => {
        const handleGamepadConnected = (e) => handleConnectDisconnect(e, true);
        const handleGamepadDisconnected = (e) => handleConnectDisconnect(e, false);

        window.addEventListener("gamepadconnected", handleGamepadConnected);
        window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            window.removeEventListener("gamepadconnected", handleGamepadConnected);
            window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [handleConnectDisconnect, gameLoop]);

    const renderButtonHtml = (index, value) => (
        <div
            key={`button-${index}`}
            className="button flex items-center justify-center bg-white p-2 rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            id={`button-${index}`}
        >
            <svg width="10px" height="50px" className="mr-2">
                <rect width="10px" height="50px" fill="gray" />
                <rect
                    className="button-meter"
                    width="10px"
                    x="0"
                    y="50"
                    data-original-y-position="50"
                    height="50px"
                    fill="rgb(60, 61, 60)"
                />
            </svg>
            <div className="button-text-area text-center">
                <div className="button-name text-sm font-semibold">B{index}</div>
                <div className="button-value text-xs">{value.toFixed(2)}</div>
            </div>
        </div>
    );

    const renderAxes = () => (
        gamepadState.axes.map((value, i) => (
            <div key={`axis-${i}`} id={`axis-${i}`} className="axis">
                <div className="axis-name text-gray-700 font-medium">AXIS {i}</div>
                <div className="axis-value text-sm font-semibold text-gray-900">
                    {value.toFixed(4)}
                </div>
            </div>
        ))
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-center items-center bg-white rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black px-5 py-0">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xmlSpace="preserve"
                    width="100%" height="100%" viewBox="0 0 600 500" className="w-full ml-2">
                    <g>
                        <g>
                            <path id="controller-b13" name="down" d="M114.003,255.595c-5.043,3.696-10.324,8.09-11.102,9.663c-1.353,2.705-3.244,17.252-2.889,22.24
     c0.073,1.053,0.306,4.26,13.972,4.266l0.042,3.06v-3.06c13.666-0.006,13.898-3.213,13.972-4.271
     c0.355-4.976-1.53-19.523-2.889-22.234C124.407,263.851,119.682,259.762,114.003,255.595z" />
                            <rect id="controller-b8" name="select" x="227.994" y="238.771" width="18.898"
                                height="7.711" />
                            <path id="controller-b12" name="up" d="M114.003,232.84c5.686-4.167,10.404-8.256,11.108-9.669c1.353-2.699,3.244-17.246,2.889-22.24
     c-0.08-1.053-0.306-4.254-13.972-4.26c-13.708,0.006-13.935,3.207-14.015,4.26c-0.355,4.987,1.53,19.535,2.889,22.24
     C103.685,224.744,108.96,229.15,114.003,232.84z" />
                            <path id="controller-b14" name="left"
                                d="M92.962,233.11c-2.46-1.229-14.584-2.925-20.918-2.925c-0.502,0-0.937,0.012-1.31,0.042
     c-1.059,0.074-4.266,0.301-4.271,13.966c0.006,13.709,3.213,13.936,4.266,14.009c0.379,0.031,0.82,0.043,1.316,0.043
     c6.34,0,18.464-1.688,20.918-2.925c1.671-0.839,6.353-6.573,9.676-11.102C98.936,239.181,94.529,233.893,92.962,233.11z" />
                            <path id="controller-b15" name="right" d="M157.284,230.234c-0.379-0.031-0.82-0.043-1.316-0.043c-6.34,0-18.464,1.689-20.924,2.925
     c-1.566,0.784-5.973,6.065-9.669,11.108c3.317,4.528,7.999,10.27,9.669,11.102c2.46,1.23,14.584,2.925,20.918,2.925
     c0.496,0,0.936-0.012,1.31-0.042c1.059-0.074,4.266-0.3,4.271-13.966c0-0.05,0-0.092,0-0.129
     C161.525,230.528,158.336,230.301,157.284,230.234z" />
                            <circle id="controller-b3" cx="465.824" cy="194.529" r="19.866" />
                            <circle id="controller-b1" cx="512.446" cy="241.152" r="19.865" />
                            <circle id="controller-b0" cx="465.824" cy="287.774" r="19.865" />
                            <circle id="controller-b2" cx="419.202" cy="241.152" r="19.865" />
                            <polygon id="controller-b9" name="select"
                                points="333.062,246.586
        349.171,241.751 333.062,237.381" />
                            <path id="layout" d="M561.234,241.611c-2.441-18.305-10.171-52.075-43.531-75.264l-8.14-31.328c0,0-0.813-7.729-10.985-13.428
     c0,0,0.612-5.288-8.745-7.729c-9.357-2.442-31.127-7.117-56.549,1.426c0,0-3.868,1.016-3.66,6.714c0,0-12.001,5.899-14.443,16.885
     c-2.441,10.985-5.697,24.816-5.697,24.816h-36.916H211.195h-39.56c0,0-3.256-13.831-5.698-24.816s-14.443-16.885-14.443-16.885
     c0.202-5.698-3.66-6.714-3.66-6.714c-25.429-8.543-47.191-3.868-56.549-1.426c-9.357,2.441-8.746,7.729-8.746,7.729
     c-10.171,5.698-10.985,13.428-10.985,13.428l-8.14,31.328c-33.36,23.188-41.09,56.959-43.532,75.264
     C17.441,259.921,1.579,380.344,0.354,394.58c-1.218,14.241-2.032,67.534,46.788,75.264s74.45-36.615,74.45-36.615l32.956-57.161
     c73.636,57.161,108.624-20.545,108.624-20.545h54.774c0,0,34.988,77.706,108.624,20.545l32.956,57.161
     c0,0,25.631,44.345,74.45,36.615s48.005-61.028,46.787-75.264C579.546,380.338,563.677,259.916,561.234,241.611z M465.824,168.544
     c14.326,0,25.985,11.658,25.985,25.985c0,14.326-11.659,25.985-25.985,25.985c-14.327,0-25.985-11.659-25.985-25.985
     C439.839,180.203,451.497,168.544,465.824,168.544z M317.322,191.175c3.776,0,7.552,0,11.322,0
     c0.036,0.129,0.049,1.983,0.012,2.265c-0.062,0.006-0.128,0.013-0.195,0.013c-0.386,0-0.777,0-1.163,0
     c-0.043,0-0.086,0-0.129,0.006c-0.152,0.024-0.238,0.122-0.208,0.275c0.024,0.116,0.073,0.245,0.141,0.343
     c0.116,0.171,0.251,0.324,0.392,0.478c1.114,1.218,2.222,2.43,3.336,3.642c0.03,0.03,0.061,0.055,0.104,0.092
     c0.049-0.056,0.099-0.104,0.147-0.153c1.261-1.377,2.515-2.754,3.775-4.131c0.031-0.031,0.062-0.067,0.08-0.104
     c0.086-0.128,0.062-0.251-0.056-0.349c-0.098-0.079-0.208-0.098-0.336-0.098c-0.392,0.006-0.79,0-1.182,0
     c-0.055,0-0.11-0.013-0.177-0.019c0-0.759,0-1.506,0-2.265c3.06,0,6.113,0,9.18,0c0,0.753,0,1.5,0,2.271c-0.067,0-0.135,0-0.202,0
     c-0.746,0-1.493,0-2.233,0c-0.123,0-0.208,0.037-0.294,0.123c-2.411,2.57-4.822,5.141-7.234,7.711
     c-0.079,0.086-0.109,0.165-0.109,0.281c0.006,0.991,0,1.977,0,2.969c0,0.042,0,0.085,0.006,0.128
     c0.019,0.196,0.116,0.312,0.318,0.337c0.085,0.012,0.171,0,0.263,0c0.839,0,1.677,0,2.516,0c0.024,0,0.049,0.006,0.086,0.012
     c0,0.68,0,1.353,0,2.032c-3.709,0-7.405,0-11.114,0c0-0.68,0-1.353,0-2.05c0.073,0,0.141,0,0.208,0c0.716,0,1.426,0,2.142,0
     c0.074,0,0.153,0,0.227-0.007c0.232-0.024,0.355-0.159,0.374-0.397c0-0.037,0-0.073,0-0.11c0-1.034,0-2.068,0-3.103
     c0-0.122-0.031-0.208-0.117-0.3c-2.282-2.503-4.571-5.007-6.848-7.51c-0.086-0.098-0.178-0.135-0.306-0.135
     c-0.833,0.007-1.665,0-2.497,0c-0.067,0-0.135,0-0.215,0C317.322,192.681,317.322,191.935,317.322,191.175z M289.892,191.169
     c0.079-0.006,0.159-0.006,0.238-0.006c2.51,0,5.025,0,7.535,0c0.109,0,0.227,0.006,0.336,0c0.135-0.013,0.232,0.03,0.337,0.122
     c0.691,0.631,1.383,1.255,2.074,1.879c2.84,2.559,5.674,5.116,8.514,7.675c0.055,0.049,0.11,0.098,0.202,0.178
     c0-0.11,0.006-0.184,0.006-0.251c0-2.032,0-4.058,0-6.09c0-0.159,0-0.312,0-0.471c0.006-0.258-0.11-0.441-0.324-0.575
     c-0.196-0.123-0.41-0.178-0.643-0.178c-0.704,0-1.402,0-2.105,0c-0.067,0-0.135,0-0.215,0c0-0.766,0-1.506,0-2.252
     c0,0,0.007-0.007,0.013-0.013s0.013-0.013,0.013-0.013c3.139-0.006,6.272-0.006,9.412-0.012c0.037,0,0.073,0.006,0.122,0.006
     c0,0.753,0,1.506,0,2.276c-0.073,0-0.141,0-0.208,0c-0.679,0-1.353,0-2.031-0.006c-0.569,0-0.82,0.239-0.845,0.814
     c-0.007,0.085-0.007,0.177-0.007,0.263c0,4.113,0,8.231,0,12.344c0,0.08,0,0.159,0,0.251c-0.073,0.007-0.122,0.013-0.177,0.013
     c-1.065,0-2.13,0-3.195,0c-0.109,0-0.189-0.03-0.269-0.104c-4.07-3.623-8.14-7.239-12.21-10.862
     c-0.049-0.043-0.104-0.086-0.184-0.153c0,0.098,0,0.159,0,0.221c0,2.723,0,5.446,0,8.17c0,0.104,0.013,0.214,0.024,0.318
     c0.019,0.116,0.092,0.189,0.215,0.208c0.135,0.019,0.275,0.024,0.41,0.024c0.765,0,1.529,0,2.295,0c0.067,0,0.135,0,0.214,0
     c0,0.729,0,1.438,0,2.16c-3.17,0-6.328,0-9.504,0c0-0.716,0-1.426,0-2.16c0.073,0,0.141,0,0.208,0c0.697,0,1.389,0,2.087,0
     c0.079,0,0.165,0,0.244-0.013c0.245-0.036,0.386-0.195,0.398-0.446c0-0.049,0-0.098,0-0.153c0-3.47,0-6.939,0-10.41
     c0-0.049,0-0.098,0-0.152c-0.007-0.294-0.116-0.429-0.398-0.478c-0.135-0.024-0.275-0.037-0.41-0.037
     c-0.648-0.006-1.303,0-1.953,0c-0.067,0-0.135,0-0.227,0C289.892,192.565,289.892,191.879,289.892,191.169z M264.072,195.111
     c0.661-1.077,1.523-1.965,2.54-2.711c1.383-1.016,2.925-1.701,4.584-2.143c1.646-0.44,3.323-0.6,5.024-0.52
     c2.093,0.098,4.101,0.551,5.998,1.456c1.322,0.631,2.515,1.451,3.513,2.534c0.888,0.961,1.549,2.044,1.879,3.316
     c0.453,1.708,0.251,3.354-0.544,4.921c-0.661,1.298-1.628,2.338-2.791,3.201c-1.414,1.046-2.993,1.744-4.682,2.185
     c-0.979,0.257-1.971,0.416-2.98,0.483c-0.392,0.024-0.79,0.006-1.181,0.006c0,0.006,0,0.013,0,0.019
     c-0.508-0.019-1.016-0.006-1.518-0.055c-2.644-0.239-5.098-1.022-7.265-2.589c-1.138-0.82-2.081-1.818-2.76-3.061
     c-0.605-1.107-0.912-2.289-0.875-3.55C263.043,197.351,263.417,196.188,264.072,195.111z M240.008,192.565
     c0.557-0.562,1.206-0.991,1.909-1.353c1.041-0.532,2.136-0.881,3.274-1.126c1.175-0.251,2.356-0.392,3.562-0.38
     c0.937,0.013,1.861,0.123,2.779,0.3c1.322,0.258,2.613,0.637,3.862,1.151c0.25,0.104,0.489,0.244,0.747,0.354
     c0.085,0.037,0.189,0.062,0.288,0.056c0.189-0.013,0.245-0.08,0.245-0.275c0-0.19,0-0.386,0-0.576
     c0.153-0.042,2.148-0.049,2.369-0.012c0,1.836,0,3.672,0,5.521c-0.765,0-1.518,0-2.289,0c-0.012-0.086-0.018-0.159-0.031-0.239
     c-0.092-0.667-0.404-1.218-0.881-1.683c-0.459-0.44-0.998-0.753-1.579-0.998c-0.79-0.343-1.622-0.557-2.466-0.703
     c-1.2-0.215-2.412-0.3-3.629-0.264c-0.899,0.031-1.799,0.104-2.681,0.324c-0.361,0.092-0.709,0.208-1.04,0.38
     c-0.239,0.122-0.465,0.275-0.643,0.478c-0.208,0.232-0.325,0.502-0.343,0.813c-0.012,0.264,0.08,0.49,0.281,0.643
     c0.166,0.129,0.355,0.239,0.545,0.318c0.447,0.196,0.93,0.288,1.414,0.373c0.949,0.166,1.91,0.251,2.871,0.343
     c1.53,0.153,3.066,0.294,4.583,0.563c1.175,0.208,2.326,0.478,3.434,0.942c0.698,0.288,1.353,0.648,1.928,1.15
     c0.894,0.777,1.396,1.75,1.493,2.932c0.135,1.523-0.392,2.772-1.548,3.764c-0.71,0.606-1.524,1.022-2.393,1.353
     c-1.016,0.386-2.068,0.631-3.139,0.796c-0.906,0.135-1.812,0.227-2.729,0.227c-0.563,0-1.126-0.067-1.683-0.159
     c-1.818-0.3-3.605-0.729-5.367-1.268c-0.233-0.073-0.459-0.152-0.673-0.275c-0.208-0.122-0.453-0.116-0.71-0.109
     c0,0.336,0,0.667,0,1.003c-0.912,0-1.805,0-2.699,0c-0.043-0.128-0.062-5.905-0.019-6.261c0.135-0.036,2.375-0.042,2.564-0.006
     c0.024,0.172,0.037,0.343,0.073,0.515c0.141,0.722,0.514,1.31,1.046,1.799c0.594,0.551,1.292,0.924,2.032,1.224
     c0.851,0.343,1.738,0.563,2.644,0.71c1.2,0.196,2.411,0.275,3.629,0.227c0.918-0.036,1.817-0.171,2.68-0.52
     c0.478-0.19,0.912-0.441,1.285-0.796c0.196-0.184,0.368-0.392,0.496-0.631c0.061-0.109,0.073-0.22,0.049-0.343
     c-0.061-0.317-0.232-0.562-0.478-0.765c-0.238-0.195-0.514-0.33-0.802-0.446c-0.575-0.233-1.181-0.367-1.793-0.478
     c-1.022-0.189-2.056-0.307-3.084-0.423c-1.475-0.171-2.95-0.324-4.406-0.594c-1.175-0.22-2.338-0.489-3.439-0.979
     c-0.667-0.294-1.292-0.667-1.806-1.2c-0.648-0.679-0.967-1.486-0.979-2.423C238.741,194.365,239.194,193.391,240.008,192.565z
      M93.911,200.502c0.704-9.938,14.278-9.944,20.067-9.951c5.845,0.007,19.407,0.013,20.123,9.945
     c0.379,5.324-1.414,21.224-3.513,25.41c-1.775,3.55-9.804,9.633-14.578,13.036c-0.135,0.122-0.281,0.226-0.447,0.317
     c-0.483,0.282-1.022,0.423-1.554,0.423c-0.202,0-0.404-0.024-0.6-0.062c-0.238-0.049-0.471-0.122-0.691-0.22
     c-0.263-0.129-0.502-0.275-0.716-0.459c-3.207-2.277-12.663-9.211-14.572-13.036C95.325,221.72,93.525,205.821,93.911,200.502z
      M70.288,264.316c-9.938-0.704-9.945-14.278-9.945-20.073c0-5.839,0.006-19.413,9.951-20.117c0.496-0.036,1.083-0.055,1.75-0.055
     c5.655,0,19.529,1.506,23.66,3.568c3.825,1.909,10.759,11.377,13.036,14.584c0.202,0.238,0.374,0.508,0.496,0.808
     c0.166,0.397,0.245,0.82,0.239,1.236c-0.006,0.452-0.11,0.911-0.318,1.334c-0.116,0.227-0.257,0.44-0.416,0.63
     c-1.805,2.559-9.051,12.589-13.036,14.578c-4.125,2.062-18.005,3.568-23.66,3.568C71.377,264.371,70.784,264.353,70.288,264.316z
      M134.101,287.927c-0.71,9.944-14.278,9.951-20.067,9.957l0,0h-0.024c-5.82-0.006-19.388-0.013-20.092-9.957
     c-0.379-5.312,1.414-21.212,3.513-25.404c1.909-3.819,11.377-10.759,14.578-13.036c0.135-0.116,0.282-0.22,0.441-0.312
     c0.232-0.135,0.477-0.239,0.728-0.312c0.795-0.214,1.659-0.128,2.393,0.294c0.196,0.116,0.379,0.251,0.539,0.397
     c4.798,3.428,12.723,9.443,14.48,12.963C132.681,266.721,134.48,282.615,134.101,287.927z M155.968,264.371
     c-5.649,0-19.529-1.505-23.654-3.567c-3.99-1.989-11.242-12.044-13.036-14.584c-0.128-0.147-0.245-0.318-0.343-0.496
     c-0.293-0.532-0.422-1.132-0.385-1.72c0.024-0.373,0.116-0.74,0.281-1.096c0.123-0.257,0.275-0.495,0.459-0.71
     c2.295-3.219,9.211-12.649,13.023-14.559c4.131-2.062,18.005-3.568,23.66-3.568c0.661,0,1.254,0.019,1.756,0.055
     c9.872,0.704,9.945,14.101,9.945,19.958c0,0.049,0,0.092,0,0.135c-0.006,5.819-0.012,19.394-9.957,20.098
     C157.223,264.353,156.629,264.371,155.968,264.371z M200.111,364.892c-22.326,0-40.49-18.164-40.49-40.484
     c0-22.325,18.164-40.489,40.49-40.489s40.49,18.164,40.49,40.489C240.607,346.728,222.437,364.892,200.111,364.892z
      M253.013,247.712c0,2.692-2.191,4.89-4.89,4.89h-21.358c-2.699,0-4.89-2.19-4.89-4.89v-10.172c0-2.692,2.191-4.89,4.89-4.89
     h21.358c2.699,0,4.89,2.191,4.89,4.89V247.712z M290.559,329.756c-18.74,0-33.991-15.244-33.991-33.99
     c0-18.745,15.245-33.99,33.991-33.99s33.991,15.245,33.991,33.99C324.55,314.512,309.305,329.756,290.559,329.756z
      M332.708,253.08c-0.281,0.092-0.582,0.129-0.882,0.129c-2.692,0-4.89-2.191-4.89-4.891v-12.613c0-2.974,2.858-5.569,5.691-4.785
     l26.243,7.123c1.334,0.361,2.258,1.573,2.258,2.95c0,2.509-1.903,4.584-4.339,4.859L332.708,253.08z M381.362,364.892
     c-22.326,0-40.49-18.164-40.49-40.484c0-22.325,18.164-40.489,40.49-40.489c22.325,0,40.489,18.164,40.489,40.489
     C421.852,346.728,403.688,364.892,381.362,364.892z M419.202,267.137c-14.327,0-25.986-11.658-25.986-25.985
     s11.659-25.985,25.986-25.985c14.326,0,25.985,11.658,25.985,25.985C445.182,255.479,433.528,267.137,419.202,267.137z
      M465.824,313.759c-14.327,0-25.985-11.658-25.985-25.985s11.658-25.985,25.985-25.985c14.326,0,25.985,11.658,25.985,25.985
     C491.804,302.101,480.15,313.759,465.824,313.759z M512.446,267.137c-14.327,0-25.985-11.658-25.985-25.985
     s11.658-25.985,25.985-25.985s25.985,11.658,25.985,25.985C538.426,255.479,526.772,267.137,512.446,267.137z" />
                            <path d="M270.437,203.63c1.407,0.997,2.993,1.444,4.541,1.462c1.181,0,2.167-0.171,3.103-0.52
     c0.067-0.024,0.116-0.074,0.184-0.099c0.012-0.006,0.031,0,0.043-0.006c1.334-0.502,2.466-1.279,3.292-2.454
     c1.114-1.579,1.377-3.292,0.704-5.116c-0.472-1.279-1.334-2.265-2.473-2.986c-0.563-0.355-1.138-0.631-1.72-0.839
     c-1.806-0.703-3.703-0.74-5.667-0.11c-1.396,0.447-2.577,1.236-3.464,2.412c-1.193,1.585-1.53,3.341-0.888,5.232
     C268.527,201.874,269.353,202.859,270.437,203.63z" />
                            <circle cx="290.000" cy="295.000" r="35" width="50.898" height="100.711"
                                stroke="black" fill="black" />
                            <rect x="227.994" y="190.0" width="120.898" height="17.5" stroke="black"
                                fill="black" />
                            <rect id="controller-b4" x="83.5" y="110.0" width="70" height="20"
                                rx="16.5" strokeWidth="3"></rect>
                            <rect id="controller-b5" x="429.5" y="110.0" width="70" height="20"
                                rx="16.5" strokeWidth="3"></rect>
                            <rect id="controller-b6" x="99.994" y="50.0" height="50.898" width="35.5"
                                fill="black" rx="19" ry="10" />
                            <rect id="controller-b7" x="448.994" y="50.0" height="50.898" width="35.5"
                                fill="black" rx="19" ry="10" />
                            <circle id="controller-b10-below" name="left-stick" cx="200.000"
                                cy="325.000" data-original-x-position="200.000"
                                data-original-y-position="325.000" r="15" width="50.898" height="100.711"
                                stroke="black" fill="black" />
                            <circle id="controller-b10" name="left-stick" cx="200.000" cy="325.000"
                                data-original-x-position="200.000" data-original-y-position="325.000"
                                r="35" width="50.898" height="100.711" fill="#333" />
                            <circle id="controller-b11-bottom" name="stick-right" cx="381.000"
                                cy="325.000" data-original-x-position="381.000"
                                data-original-y-position="325.000" r="15" width="50.898" height="100.711"
                                stroke="black" fill="black" />
                            <circle id="controller-b11" name="stick-right" cx="381.000" cy="325.000"
                                data-original-x-position="381.000" data-original-y-position="325.000"
                                r="35" width="50.898" height="100.711" fill="#333" />
                        </g>
                    </g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                </svg>
            </div>
            <div className="flex p-7 bg-blue-500 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black md:col-span-2">
                <div className="text-center text-lg w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl">INPUT TEST</h2>
                        <div
                            id="rumble-on-button-press-area"
                            className="flex items-center space-x-2 text-center ml-auto"
                        >
                            <input
                                id="rumble-on-button-press"
                                type="checkbox"
                                className="checkbox bg-red-600 border-2 border-black"
                                disabled={controllerIndex === null}
                            />
                            <label htmlFor="rumble-on-button-press" className="text-light">
                                &nbsp;VIBRATION
                            </label>
                        </div>
                    </div>
                    <div id="controller-connected-area" className={controllerIndex !== null ? 'block' : 'hidden'}>
                        <div id="buttons" className="grid grid-cols-3 gap-4 md:grid-cols-7">
                            {gamepadState.buttons.map((button, i) => renderButtonHtml(i, button.value))}
                            {renderAxes()}
                        </div>
                    </div>
                    {controllerIndex === null && (
                        <div
                            role="alert"
                            className="alert rounded bg-red-600 text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-6"
                        >
                            <BsInfoCircle/>
                            <span>Controller Disconnected.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Gamepad;