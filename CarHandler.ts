namespace CarHandler {

    let lightStripPin = DigitalPin.P8;
    let strip = neopixel.create(lightStripPin, 4, NeoPixelMode.RGB); // 0 = left front, 1 = right front, 2 = right back, 3 = left back

    export function EnableRGBLED(led : LedCount, enable : boolean){
        let state = enable ? LedState.ON : LedState.OFF;
        mecanumRobot.setLed(led, state);
    }

    // ---- SENSORS ----
    let leftSensor = DigitalPin.P0;
    let rightSensor = DigitalPin.P13;
    let frontRightSensor = DigitalPin.P12;
    let frontLeftSensor = DigitalPin.P7; // works only when display is disabled

    export function SetupSensors(){
        pins.setPull(leftSensor, PinPullMode.PullNone);
        pins.setPull(frontLeftSensor, PinPullMode.PullNone);
        pins.setPull(frontRightSensor, PinPullMode.PullNone);
        pins.setPull(rightSensor, PinPullMode.PullNone);

        led.enable(false); // this makes P7 show correct value, display does not works tho :(
    }

    export function GetLeftSensorState() { return pins.digitalReadPin(leftSensor) === 0; }
    export function GetRightSensorState() { return pins.digitalReadPin(rightSensor) === 0; }
    export function GetLeftFrontSensorState() { return pins.digitalReadPin(frontLeftSensor) === 0; }
    export function GetRightFrontSensorState() { return pins.digitalReadPin(frontRightSensor) === 0; }

    // ---- MOVEMENT ----
    export function Gobackward(speed: number) { GoForward(-speed); }
    export function GoForward(speed: number) { Move(speed, speed); }

    /** does not work with ks4031 for some reason */
    export function WeirdMove(speed: number) {
        RightFrontWheel(speed);
        RightBackWheel(-speed);

        LeftFrontWheel(speed);
        LeftBackWheel(-speed);
    }

    export function StopCar() { Move(0, 0); }

    function Move(rSpeed: number, lSpeed: number) {
        RightFrontWheel(rSpeed);
        RightBackWheel(rSpeed);

        LeftFrontWheel(lSpeed);
        LeftBackWheel(lSpeed);
    }

    export function Test(){
        for(let i = 0; i < wheels.length; i++) TestWheel(i);
    }

    function TestWheel(wheel : number){
        for (let i = 0; i < 8; i++) {
            let sp = i % 2 === 0 ? 100 : - 100;
            SetWheel(wheel, sp);
            basic.pause(500);
        }

        SetWheel(wheel, 0);
    }

    // ROTATION
    const defAngleTime = 1150; // prev = 750 // how long does it take to rotate 180° at "rotateSpeed" in ms
    const rotateSpeed = 80; // -100 -> 100

    export function RotateRight(angle: number) { Rotate(-angle); }

    export function RotateLeft(angle: number) { Rotate(angle); }

    /** positive angle = left, negative angle = right */
    export function Rotate(angle: number) {
        StopCar();

        basic.pause(100);

        let sp = angle < 0 ? -rotateSpeed : rotateSpeed;
        Move(sp, -sp);

        basic.pause((defAngleTime / 180) * Math.abs(angle));

        StopCar();
    }

    /** lover force = longer turn */
    export function RightTurn(speed: number, turnForce: number) { Move(speed / turnForce, speed); }

    /** lover force = longer turn */
    export function LeftTurn(speed: number, turnForce: number) { Move(speed, speed / turnForce); }


    /// ---- --- WHEELS --- ---- \\\
    let wheels = [LR.Upper_right, LR.Upper_left, LR.Lower_right, LR.Lower_left];

    let invert = [false, false, false, false];
    
    let minSpeedF = [16, 13, 9, 10]; // if requested speed is lower than this => 0 will be sent instead
    let minSpeedB = [13, 10, 8, 8];

    let maxSpeedF = [100, 85, 58, 65]; // in %
    let maxSpeedB = [100, 85, 63, 63]; // in %

    function RightFrontWheel(speed: number) { SetWheel(0, speed); }
    function LeftFrontWheel(speed: number) { SetWheel(1, speed); }
    
    function RightBackWheel(speed: number) { SetWheel(2, speed); }
    function LeftBackWheel(speed: number) { SetWheel(3, speed); }

    function SetWheel(id : number, speed : number){
        if (invert[id]) speed = -speed;

        let direction = speed < 0 ? MD.Back : MD.Forward;
        let mSp = speed < 0 ? maxSpeedB[id] : maxSpeedF[id];

        let fSpeed = Math.map(Math.abs(speed), 0, 100, 0, mSp);

        if (speed < 0){
            if (fSpeed < minSpeedB[id]) fSpeed = 0;
        }
        else{
            if (fSpeed < minSpeedF[id]) fSpeed = 0;
        }

        //console.log(`speed ${id} = ${fSpeed}`);

        mecanumRobot.Motor(wheels[id], direction, fSpeed);
    }
}