# Plugin Command Example

## Preparation
Create a new map via "Load Sample Map..." and select the "Mountain Village" map. Then start the game and switch to the Lighting Editor.

## Lighting

### 1. Create an Ambient Light on the new map.

![](screenshots/tut01-01.png)

### 2. Set values like these to represent nighttime:

![](screenshots/tut01-02.png)

### 3. Create a Point Light and configure these values to simulate a warm, flickering torchlight:

![](screenshots/tut01-03.png)

### 4. Disable the Point Light and copy the ```mapObject``` value to clipboard.

![](screenshots/tut01-04.png)

![](screenshots/tut01-05.png)

You can now save and close the editor.

## Event

### 1. Back in RPG Maker - edit the torch event:

![](screenshots/tut01-06.png)

### 2. To activate the Point Light you created in the Lighting Editor, add a Plugin Command.

Select ```TausiLighting.Interpolate```. Below are some arguments. Choose ```Objects```.

![](screenshots/tut01-07.png)

### 3. In the Structure List, add an ```Object```.

Another dialog will appear where you can edit the ```Object``` arguments:

![](screenshots/tut01-08.png)

### 4. Edit ```Target``` and paste the value from your clipboard.

![](screenshots/tut01-09.png)

### 5. Also edit ```Value``` and set it to ```1```.

The ```Enabled``` property can remain untouched - it works correctly in this case.

Confirm both dialogs with ```OK```.

![](screenshots/tut01-10.png)

### 6. Finally set the ```Duration``` value to ```0``` because we don't need interpolation in this simple example.

Also confirm with ```OK```.

![](screenshots/tut01-11.png)

### 7. Completion

Duplicate the command and change the ```Enabled``` value to ```0``` to also deactivate the light.

Here's an example of the complete event setup to toggle the torchlight via actions:

![](screenshots/tut01-12.png)
