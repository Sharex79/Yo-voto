# En este archivo se hablará de configuración que se debe usar para mayor optimización a la hora de crear la web && información de los siguientes elementos y como usarlos
0- Configuración<br>
1- Información<br>
2- Como comenzar a trabajar<br>
PD : si se desea leer este documento mejor por favor haga [Clic derecho] sobre el archivo en el menú de la izquierda y dadle a "Open Preview"
<hr>









## 0- Configuración...
### 1- Descargar estas extensiones en la app...
##### Visual Code; Git Graph ( para poder moverse entre las branch de manera fácil)
##### Live Server (Para arrancar la página , aunque escribiendo en la consola (que se abre con CTRL+SHIFT+Ñ) "node run dev" se arranca la web)
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/0.png>)
<hr>

### 2- Configuración para guardar constantemente los Archivos
##### Gracias a lo que se verá a continuación cualquier cambio que se haga se cambiará automaticamente, asi se podrá trabajar y ver el cambio hecho al momento y no solo al guardar los archivos
### CTRL + ,
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/savesauto.png>)
##### Dentro de este panel colocar el auto saves en After Delay...

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

## 1- Está la carpeta inicial, Yo_Voto es la raíz...
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/1.png>)
<hr>

## 1.2- Directorios...
#### [Node_modules] es la carpeta de comandos y cosas de Node, lo que usamos para crear y sacar la web
#### [public] caerpetas donde se añaden las fotos y elementos multimedia
#### [SRC] donde tenemos nuestro Main.js(archivo que es la base de nuestra web) + style.css(diseño); Dentro tambíen tenemos carpetas, las cuales son la representación de cada parte de nuestra web y los elementos en su interior
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/2.png>)
<hr>

## 1.3- Elementos...
#### [.gitgnore] Como dice el nombre, es un archivo que hace que cuando se sube el proyecto a git no se suban elementos que no se desean y que pesan mucho... [nodes modules por ejemplo]
#### [Explicación] Obviamente este archivo
#### [index.html] NO SE TOCA, es el esqueleto del main, osea es algo encadenado... index.html>>main.js>>elementos de html.
#### [Package-lock.json] && [Package.json] son archivos que son para dar información a las herramientas de node... con ello podemos usar el npm run dev para arrancvar la imagen y diferente información extra.
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/3.png>)
<hr>

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

## 2- Como Trabajar????'
#### Primero hablamos con el team de como y que haremos, en plan que parte del html de x pagina haremos 
#### (ejemplo : YO Alex, de la pagina de informacion inicial haré el módulo este de 4 cuadritos con informacion, que cuando le des clic de abran en pantalla completa y ver que es)
<hr>

### 2.1 Primero nos vamos para el main o la ultima parte del proyecto y creamos nuestra branch
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/2-1.png>)
#### En esta foto muestro :
##### Menú izq : donde vamos a ver las branches y para guardar
##### Cajon verde : donde vemos lo que ha cambiado, el mensaje que queremos ponerle ( donde se da informaciónd e lo que se añada ( yo uso tambien # en plan 0.1; 0.5...) y el botón commit para guardar, y luego ese boton se convierte en otro para subirlo a la branch)
##### Cuadradito rojo : es lo que instalamos, la extensión que abre una pesataña para ver las branch de mejor manera
<br>
<br>
<br>
<br>
<br>

## Ejemplo de Hacer cambios en una Branch y subirla para que todos la vean
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/cambio1.png>)
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/cambio2.png>)
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/cambio3.png>)
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/cambio4.png>)
<hr>
<hr>
<hr>
<br>

### 2.2- Como creo una branch???
#### Desde ese menu que añadimos como extensión vamos al punto donde queremos hacer una división para trabajr en otroa rchivo ( branch )
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/branch.png>)
#### Moverse por otras ramas para ver la parte del proyecto de antes es con doble clic sobre la branch,,, pero el termino tambien es "checkout"
<br>

![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/branch1.png>)
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/branch2.png>)
![Estructura de carpetas del proyecto](<./public/Explicación(MD) Fotos/branch3.png>)

#### Poco más, usar esa nomenclatura al crear branch para saber quien la hizo, que elemnto es y para que pagina html será
# OJO al hacer commit, que sea en la rama que toca, que sino se puede regar y no saber que cambio se hizo...
<hr>
<hr>
<hr>
<br>



### 2.3 Y como comienzo a crear archivos????

