const leftFrontWheel = PCAmotor.Servos.S1;
const rightFrontWheel = PCAmotor.Servos.S2;
const leftBackWheel = PCAmotor.Servos.S3;
const rightBackWheel = PCAmotor.Servos.S4;

// ?
// min = 500, max = 2500
const lfwMap = [620, 2500];
const rfwMap = [600, 2500];
const lbwMap = [600, 2500];
const rbwMap = [600, 2500];

let speed = 25; // in % , max = 100, min = -100

input.onButtonPressed(Button.A, function () {
    Test();
})

input.onButtonPressed(Button.B, function () {
    RotateRight(90);
    RotateLeft(90);
})

function Test() {
    let sp = 100;

    GoForward(sp);
    basic.pause(2500);

    RightTurn(sp);
    basic.pause(2500);

    LeftTurn(sp);
    basic.pause(2500);

    StopAll();

    Gobackward(sp);
    basic.pause(2500);

    WeirdMove(sp);
    basic.pause(1000);

    WeirdMove(-sp);
    basic.pause(1000);

    RotateRight(90);
    RotateLeft(90);

    GoForward(sp);
    basic.pause(1000);

    StopAll();
}

function GoForward(speed: number) { Move(-speed, speed); }

function Gobackward(speed: number) { Move(speed, -speed); }

function RightFrontWheel(speed: number) {
    let mSpeed = GetMotorSpeed(speed, rfwMap);
    console.log(`right front ${mSpeed}`);
    PCAmotor.GeekServo(rightFrontWheel, mSpeed);
}

function LeftFrontWheel(speed: number) {
    let mSpeed = GetMotorSpeed(speed, lfwMap);
    console.log(`left front ${mSpeed}`);
    PCAmotor.GeekServo(leftFrontWheel, mSpeed);
}

function RightBackWheel(speed: number) {
    let mSpeed = GetMotorSpeed(speed, rbwMap);
    console.log(`right back ${mSpeed}`);
    PCAmotor.GeekServo(rightBackWheel, mSpeed);
}

function LeftBackWheel(speed: number) {
    let mSpeed = GetMotorSpeed(speed, lbwMap);
    console.log(`left back ${mSpeed}`);
    PCAmotor.GeekServo(leftBackWheel, mSpeed);
}

function WeirdMove(speed: number) {
    RightFrontWheel(speed);
    RightBackWheel(-speed);

    LeftFrontWheel(speed);
    LeftBackWheel(-speed);
}

function StopAll() {
    PCAmotor.StopServo(PCAmotor.Servos.S1);
    PCAmotor.StopServo(PCAmotor.Servos.S2);
    PCAmotor.StopServo(PCAmotor.Servos.S3);
    PCAmotor.StopServo(PCAmotor.Servos.S4);
}


function Move(rSpeed: number, lSpeed: number) {
    MoveRightSide(rSpeed);
    MoveLeftSide(lSpeed);
}

function MoveLeftSide(speed: number) {
    LeftFrontWheel(speed);
    LeftBackWheel(speed);
}

function MoveRightSide(speed: number) {
    RightFrontWheel(speed);
    RightBackWheel(speed);
}

function GetMotorSpeed(speed: number, map: number[]): number {
    if (map[0] < 500 || map[1] > 2500) {
        music.playTone(99, 99999);
        basic.pause(99999);
    }

    return Math.map(speed, -100, 100, map[0], map[1]);
}

// ROTATION
const defAngleTime = 1350; // how long does it take to rotate 180° at "rotateSpeed" in ms
const rotateSpeed = 100; // max = 100, min = -100

function RotateRight(angle: number) { Rotate(angle, true); }

function RotateLeft(angle: number) { Rotate(angle, false); }

// the "angle" is pretty pointless since it basically works only for 90° xD
function Rotate(angle: number, right: boolean) {
    StopAll();

    basic.pause(100);

    let sp = right ? rotateSpeed : -rotateSpeed;
    Move(sp, sp);

    basic.pause((defAngleTime / 180) * angle);

    StopAll();
}

function RightTurn(speed: number) { Move(-speed / 2, speed); }

function LeftTurn(speed: number) { Move(-speed, speed / 2); }