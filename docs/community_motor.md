---
id: community_motor
title: How to make your first robot
sidebar_label:  Your first robot
---

## What kind of robot?

In this tutorial we want to make a robot that can drive a predefined route and move around objects blocking its route.

![Demonstration](/img/community/demonstration.gif)

## What you need

Below is a ist of everything you need. However, if you are wanting to attempt more projects, this list includes essential items that you can use for every project.
**Important:** These are links only for german products.<br/>

### 1. Electronics
1.  [VHDPlus Core MAX10](https://www.trenz-electronic.de/)
2.  [1 Motor driver*](https://amzn.to/2MtHv67)
3.  [2 Motors with wheel and encoder*](https://amzn.to/2YZxlPF)
4.  [1-5 Ultrasonic sensors*](https://amzn.to/2Et1LjK)
5.  [1 12V battery holder*](https://amzn.to/35WLq3d)
6.  [3-15 1k resistors*](https://amzn.to/34oD8PP)
7.  [8 AA Batteries*](https://amzn.to/2ENG7qK)
8.  [1 Breadboard and some jumper cables*](https://amzn.to/2EqAjDm)
9.  [1 Jumper connector kit*](https://amzn.to/2YZrY3c)
### 2. Casing
1. [Some wood* (or be creative)](https://amzn.to/2YWrn26)
2. [M3 Screws*](https://amzn.to/38LrT7K)
### 3. Tools
1. [Screwdriver*](https://amzn.to/2PQbCWg)
2. [D-SUB Crimping Tool*](https://amzn.to/2Q5JcIb)
3. [Cordless Screwdriver*](https://amzn.to/2LVNEb7)
4. [Drill bit set*](https://amzn.to/35h8qcN)

*These links are Affiliate Links, by purchasing with them, you support us and our work. As a customer, you pay the same price, we receive part of their revenue through commission.

## The hardware

### The "casing"

Be creative by inventing your own casing. The easiest way possible is by taking [some wood plank*](https://amzn.to/2YWrn26) and mount the motors.
If you have the [same motors as me*](https://amzn.to/2YZxlPF), start by taking the mount, drilling some holes with a [cordless screwdriver*](https://amzn.to/2rV8cth) and a 3mm drill bit and secure it with the M3 screws. This is how my solution looks:

![Motor](/img/community/Motor_Mount.jpg)

Using the same method you can mount the [ultrasonic sensors*](https://amzn.to/2Et1LjK). Ideally you will have two that look to the sides and one more that looks forward, this is so they can detect when the robot hits an object. If you purchased a set of 5 sensors with the mount, you can arrange them like this:

![Ultrasonic](/img/community/US_Mount.jpg)

### Electronics

#### Motors
First we connect the motors like this:
![Motor connect](/img/community/Motor_Connect.png)
You can use the [breadboard and jumper cables*](https://amzn.to/2EqAjDm) to make the connections. Use the [Jumper connector kit*](https://amzn.to/2YZrY3c) and the [D-SUB crimping tool*](https://amzn.to/2Q5JcIb) to be able to plug the motor cables into the breadboard. You can see how to do this [here](https://www.youtube.com/watch?v=M84VcMeAzzw).

The yellow cables and the [motor driver*](https://amzn.to/38JvUJG) inputs should be connected with the FPGA I/Os. The [Battery*](https://amzn.to/35WLq3d) is connected with GND and +12 of the motor driver and GND and +5V has to be connected with GND and VIN of the FPGA. The blue cables of the motors have to be connected with 3.3V and the black cables with GND. Finaly the motors have to be connected with the motor outputs of the motor driver. 

#### Ultrasonic sensors
Connect the ultrasonic sensors like this:
![US connect](/img/community/US_Connect.png)
Connect the GND and VCC pins of the ultrasonic sensors with GND and VBUS of the Core Board.<br/>**Important:** As the ultrasonic sensors won't work with 5V, it's important to make the Echo output of the sensor 3.3V. This is where I used a voltage divider. You have a 5V output on top, then two [1k resistors*](https://amzn.to/34oD8PP) parallel (this makes 0.5k). Connect this with the 3.3V output and then one 1k resistor that connects that with GND.<br/>
Finaly, all Echo outputs should be connected through the voltage divider (or level shifter) with the FPGA. The Trigger pins should be connected together with one FPGA pin.

#### Debugging
If you want to get information about the current state of the route, you can use the [example from Github](https://github.com/leonbeier/VHDPlus_Libraries_and_Examples/tree/master/Examples/Hardware/Output/Motor_Route) connect a [HC-05 bluetooth module*](https://amzn.to/2rw1Bpe) with the RX and TX I/Os. This allows you to connect your phone with the module and get live updates to a Serial Blutooth Terminal app.

## The software

Start by creating a new project and import the Motor library folder, the PWM library and the Ultrasonic library.
Now you can copy this example:

```vhdp
Main
(
    Encoder_L           : IN STD_LOGIC;
    Encoder_R           : IN STD_LOGIC;
    Motor_LF            : BUFFER STD_LOGIC;
    Motor_LB            : BUFFER STD_LOGIC;
    Motor_RF            : BUFFER STD_LOGIC;
    Motor_RB            : BUFFER STD_LOGIC;
    
    Trigger             : OUT STD_LOGIC;
    EchoL               : IN STD_LOGIC;
    EchoF               : IN STD_LOGIC;
    EchoF1              : IN STD_LOGIC;
    EchoF2              : IN STD_LOGIC;
    EchoR               : IN STD_LOGIC;
    
    btn                 : in STD_LOGIC;
    RX                  : IN STD_LOGIC;
    TX                  : BUFFER STD_LOGIC;
)
{
    --Motor controller settings
    CONSTANT CLK_Frequency                        : NATURAL := 12000000; --12MHz
    CONSTANT Motor_Controller_Holes_In_Disk       : NATURAL := 11;    --11 = 11 Changes for one encoder turn
    CONSTANT Motor_Controller_Gear_Ratio          : NATURAL := 34;    --34 = 1:34 Gear ratio
    CONSTANT Motor_Controller_Wheel_Circumference : NATURAL := 204;   --204 = 65mm diameter*pi = 204mm circumference
    CONSTANT Motor_Controller_Max_Length          : NATURAL := 10000; --10m maximum route step length
    CONSTANT Motor_Controller_Route_Steps         : NATURAL := 10;    --10 steps maximum
    
    Process Route_Start_Process ()
    {
        --If object is closer than 12cm, the robot tries to surround it
        If(Ultrasonic_Controller_Dist_F < 12 OR Ultrasonic_Controller_Dist_F1 < 12 OR Ultrasonic_Controller_Dist_F2 < 12)
        {
            Motor_Collision <= '1';
        }
        Else
        {
            Motor_Collision <= '0';
        }

        --Start route by pressing button
        Motor_Route_Start <= btn;
        
        --Define Route to 80cm + 20cm + turn 90° left + 50cm
        Motor_Route_L      <= (800,  200, -155, 500, 0, 0, 0, 0, 0, 0);
        Motor_Route_R      <= (800,  200,  155, 500, 0, 0, 0, 0, 0, 0);
        --Set speed to 200 for driving streight and 170 for turns
        Motor_Route_Speed  <= (200,  200,  170, 200, 0, 0, 0, 0, 0, 0);
        --Set number of route steps
        Motor_Route_Length <= 4;
    }
    
    SIGNAL Motor_Collision           : STD_LOGIC;
    SIGNAL Motor_Route_Start         : STD_LOGIC;
    SIGNAL Motor_Route_L             : Route_Array (0 to Motor_Controller_Route_Steps-1);
    SIGNAL Motor_Route_R             : Route_Array (0 to Motor_Controller_Route_Steps-1);
    SIGNAL Motor_Route_Speed         : Route_Array (0 to Motor_Controller_Route_Steps-1);
    SIGNAL Motor_Route_Length        : NATURAL     range 0 to Motor_Controller_Route_Steps;
    SIGNAL Motor_Route_Finished      : STD_LOGIC;
    SIGNAL Motor_Route_Error         : STD_LOGIC;
    SIGNAL Motor_Route_State         : NATURAL range 0 to 255;

    NewComponent Motor_Route_Drive
    (
        CLK_Frequency       => CLK_Frequency,
        Route_Steps         => Motor_Controller_Route_Steps,
        Max_Length          => Motor_Controller_Max_Length,
        --Left motor has to turn -15.5cm and right motor 15.5cm at speed 170/255 to make 90° with my robot
        Turn_Length         => 155,
        Turn_Speed          => 170,
        --Drive 15cm at speed 200/255 back when object in front of robot
        Back_Length         => 150,
        Back_Speed          => 200,
        --Has sensors on the right and left, so Side_Distances is true
        Side_Distances      => true,
        --Checks every 10cm if route is clear (drives 10cm further if yes)
        Check_Distance      => 100,
        Holes_In_Disk       => Motor_Controller_Holes_In_Disk,
        Gear_Ratio          => Motor_Controller_Gear_Ratio,
        Wheel_Circumference => Motor_Controller_Wheel_Circumference,
        --Don't check if wheel is turning for fist 500ms
        Error_Delay         => 500,
        --Correct speed every 10 encoder edges
        Correction_Step     => 1,
        Correction_Cycles   => 10,
        --If 2cm length difference, subtract 25/255 speed
        Length_Corr_Step    => 25,
        Max_Length_Diff     => 20,
        --Increase 10cm 100/255 speed for acceleration
        Accel_Length        => 100,
        Accel_Speed         => 100,
        --Decrease 10cm 100/255 speed for braking
        Brake_Length        => 100,
        Brake_Speed         => 100,
        --2s for one wheel turn is minimum speed while accelerating and braking + 20s for wheel turn to trigger error
        Max_Turn_Time       => 2000,
        
        Reset               => '0',
        Encoder_L           => Encoder_L,
        Encoder_R           => Encoder_R,
        Motor_LF            => Motor_LF,
        Motor_LB            => Motor_LB,
        Motor_RF            => Motor_RF,
        Motor_RB            => Motor_RB,
        Collision           => Motor_Collision,
        Distance_F          => Ultrasonic_Controller_Dist_F,
        Distance_L          => Ultrasonic_Controller_Dist_L,
        Distance_R          => Ultrasonic_Controller_Dist_R,
        Route_Start         => Motor_Route_Start,
        Route_Finished      => Motor_Route_Finished,
        Route_L             => Motor_Route_L,
        Route_R             => Motor_Route_R,
        Route_Speed         => Motor_Route_Speed,
        Route_Length        => Motor_Route_Length,
        Route_Error         => Motor_Route_Error,
        State               => Motor_Route_State,
    );
    
    SIGNAL Ultrasonic_Controller_Dist_L             : NATURAL   range 0 to 1000;
    
    NewComponent Ultrasonic_Controller
    (
        CLK_Frequency    => CLK_Frequency,
        Update_Frequency => 15,
        
        Reset            => '0',
        Trigger          => Trigger,
        Echo             => EchoL,
        Dist             => Ultrasonic_Controller_Dist_L,
    );
    
    SIGNAL Ultrasonic_Controller_Dist_F             : NATURAL   range 0 to 1000;
    
    NewComponent Ultrasonic_Controller
    (
        CLK_Frequency    => CLK_Frequency,
        Update_Frequency => 15,
        
        Reset            => '0',
        Echo             => EchoF,
        Dist             => Ultrasonic_Controller_Dist_F,
    );
    
    SIGNAL Ultrasonic_Controller_Dist_F1            : NATURAL   range 0 to 1000;
    
    NewComponent Ultrasonic_Controller
    (
        CLK_Frequency    => CLK_Frequency,
        Update_Frequency => 15,
        
        Reset            => '0',
        Echo             => EchoF1,
        Dist             => Ultrasonic_Controller_Dist_F1,
    );
    
    SIGNAL Ultrasonic_Controller_Dist_F2            : NATURAL   range 0 to 1000;
    
    NewComponent Ultrasonic_Controller
    (
        CLK_Frequency    => CLK_Frequency,
        Update_Frequency => 15,
        
        Reset            => '0',
        Echo             => EchoF2,
        Dist             => Ultrasonic_Controller_Dist_F2,
    );
    
    SIGNAL Ultrasonic_Controller_Dist_R             : NATURAL   range 0 to 1000;
    
    NewComponent Ultrasonic_Controller
    (
        CLK_Frequency    => CLK_Frequency,
        Update_Frequency => 15,
        
        Reset            => '0',
        Echo             => EchoR,
        Dist             => Ultrasonic_Controller_Dist_R,
    );
}
```

This example defines a simple route and by pressing the button, the robot will start driving.

Make sure to set Holes_In_Disk, Gear_Ratio and Wheel_Circumference according to your motor and wheel. With Accel_Length, Accel_Speed, Brake_Length and Brake_Speed you can make driving smoother by accelerating and braking. Also remember to check Turn_Length, Turn_Speed, Back_Length and Back_Speed to optimize movements around objects that might be blocking its route. 

You can find the full example [here](https://github.com/leonbeier/VHDPlus_Libraries_and_Examples/tree/master/Examples/Hardware/Output/Motor_Route).

## Conclusion

The hard part is the hardware and wiring. However, if you finished this tutorial the real fun can begin. Try to make this your project - for example, by allowing the robot to bring you items. Connect it to wifi and use and app to control it, connect it with Alexa and say "Alexa bring me the trashcan" and watch as the robot comes to you. Through internet searches you can find a lot more information to expand your project.

Here are other projects with a motor controller:<br/>
1. [Robot that protects objects on it](https://github.com/leonbeier/SGuard)

## Possible problems

Firstly, ensure that everything is connected as described and that you chose the correct pins of your FPGA.

### 1. Only one wheel turns

For example, when you connect the encoders correctly, but flip the right and left motor output, the robot will try to correct the speed and end up having only one wheel turn. 
To correct this, turn the wheel of the spinning motor and check if the encoder input changes it's state (e.g. by connecting the encoder input with the led). If not, check every part between the encoder and FPGA ensuring that everything is connected. You can use a multimeter and check if the voltage changes between 0 and 3V when you turn the wheel.

### 2. No wheel turns

1. Make sure that Route_Steps is not 0 and that the lengths are > 0.
2. Error_Delay might be too low (if CLK_Frequency is correct this is in ms)
3. Make sure that there is a signal at the motor output pins (with a multimeter or by connecting the signal with an LED).
   - If there is an output, check if the motor driver is working by connecting the input pin directly with 3.3V. Check with a multimeter the voltages of the motor driver in and outputs. If it outputs voltage, check the connection between driver and motor. Alternatively try a different motor driver.
   - If there is not output at the motor pins, check if you chose the correct pins and that the Route_Start changes from '0' to '1' at the beginning (you will need to press the button to start driving).

### 3. Both wheels turn, but in opposite direction

Check which wheel truns backwards and switch the connection of the M1 and M2 motor driver output.

### 4. The wheels are working but don't drive the desired lenghts

Check the Holes_In_Disk, Gear_Ratio and Wheel_Circumference parameters again. Holes_In_Disk is the number of changes from '0' to '1' of the encoder input for a one wheel turn. Gear_Ratio can be found in the motor description (1:90 = 90). Wheel_Circumference is the diameter of the wheel (in mm) multiplied by 3.14 (pi). Finally, check if all your distances are in mm (1m = 100cm = 1000mm).

### 5. The robot doesn't drive straight

With Correction_Step, Correction_Cycles, Length_Corr_Step and Max_Length_Diff you can adjust this. 
1. If the encoder spins very quickly and the speed changes fast, increase the Correction_Cycles and Max_Length_Diff and decrease the Correction_Step and Length_Corr_Step.
2. If the encoder is connected directly with the wheel and spins slowly, decrease the Correction_Cycles and Max_Length_Diff and increase the Correction_Step and Length_Corr_Step.
3. If this doesn't help, you can try to change the Debounce_Cycles constant in the Motor_Route_Drive library.

### 6. The robot doesn't drive all route parts

- Check if Route_Steps is correct.
- Potentially the Brake_Speed is too high and the motor doesn't have enough power at the end

### 7. The robot drives the wrong route

- Check if Collision is '0'
- Error_Delay might be too low (if CLK_Frequency is correct this is in ms)
- The left and right motors might be switched
- Check if the lengths are correct (see 4.)

### 8. The robot doesn't stop precisely enought

You can set the length and amount of speed difference (0-255) that the motor should brake in. Brake_Length sets the length at the end of a route part, that the robot should decelerate within (in mm). With Brake_Speed you can set how much the robot should brake. Be cautious - the robot should have enough power at the end of the route part to finish. 

We hope you enjoyed this tutorial, feel free to check out
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vhdp) if you have problems
- [Youtube](https://www.youtube.com/channel/UC7qiOvlaBSiWyAb7R1xTaEw) if you are interested in more tutorials
- [Github](https://github.com/search?utf8=%E2%9C%93&q=vhdplus) for more examples and inspiration
