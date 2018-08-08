//Arquivo princiapal

//Variáveis da janela

let coord_canvas = document.getElementById('coord_canvas');
let main_canvas = document.getElementById('main_canvas');
let context_main_canvas = main_canvas.getContext('2d');
let table_shapes = document.getElementById("table_shapes");
let selection_input = document.getElementById("selection");
let selection_string = "";
let command_selection_string = "";
let command_point_string = "";
let command_values_string = "";
let command_degs_string = "";
let extend_string = "";
let point_input = document.getElementById("point");
let values_input = document.getElementById("values");
let degs_input = document.getElementById("degs");
let command_input = document.getElementById("command");
let mouse_pos;

//Variáveis da lógica
const VIEWPORT_SIZE = 700;
const WORLD_SIZE = 7000;

let viewport_start;
let viewport_end;
let viewport_dist;
let window_scale;
let window_start;
let window_end;
let is_zooming = false;

let shapes = [];
let points = [];
let n_points = 0;
let op_point;
let op_values;
let op_degs;
let selection_elements = [];
let actual_selection_elements = [];
let actual_id = -1;
let actual_drawing = 0; //0: nada, 1: linha, 2: triangulo, 3: retangulo, 4: circulo

//Funções de tranformações

function rescale() {
    let shape;
    let nearest;

    if(selection_elements.length === 0){
        alert("Não há elementos selecionados para fazer escala");
        return;
    }

    readArgs(true, 0);

    for(let i = 0; i < selection_elements.length; i++){
        shape = shapes[selection_elements[i]];
        nearest = shape.findNearest(op_point);

        switch(shape.name){
            case "Circulo":
                nearest.scaleRelativeTo(op_values.x, op_values.y, shape.center);
                shape.radius = Point.calcDist(shape.border, shape.center);
                break;

            case "Linha":
                nearest.scaleRelativeTo(op_values.x, op_values.y, shape.a);
                nearest.scaleRelativeTo(op_values.x, op_values.y, shape.b);
                break;

            case "Retângulo":
                nearest.scaleRelativeTo(op_values.x, op_values.y, shape.a);
                nearest.scaleRelativeTo(op_values.x, op_values.y, shape.b);
                nearest.scaleRelativeTo(op_values.x, op_values.y, shape.c);
                nearest.scaleRelativeTo(op_values.x, op_values.y, shape.d);
                break;

            case "Triângulo":
                nearest.scaleRelativeTo(op_values.x, op_values.y, shape.a);
                nearest.scaleRelativeTo(op_values.x, op_values.y, shape.b);
                nearest.scaleRelativeTo(op_values.x, op_values.y, shape.c);
                break;
        }
    }

    refreshTable();
    drawAll();
}

function translation() {
    let shape;

    if(selection_elements.length === 0){
        alert("Não há elementos selecionados para fazer translação");
        return;
    }

    readArgs(false, 1);

    for(let i = 0; i < selection_elements.length; i++){
        shape = shapes[selection_elements[i]];

        switch(shape.name){
            case "Circulo":
                shape.center.translateTo(op_values);
                shape.border.translateTo(op_values);
                break;
            case "Linha":
                shape.a.translateTo(op_values);
                shape.b.translateTo(op_values);
                break;
            case "Retângulo":
                shape.a.translateTo(op_values);
                shape.b.translateTo(op_values);
                shape.c.translateTo(op_values);
                shape.d.translateTo(op_values);
                break;
            case "Triângulo":
                shape.a.translateTo(op_values);
                shape.b.translateTo(op_values);
                shape.c.translateTo(op_values);
                break;
        }
    }

    refreshTable();
    drawAll();
}

function rotateElem() {
    let shape;

    if(selection_elements.length === 0){
        alert("Não há elementos selecionados para fazer rotação");
        return;
    }

    readArgs(false, 2);

    for(let i = 0; i < selection_elements.length; i++){
        shape = shapes[selection_elements[i]];

        switch(shape.name){
            case "Circulo":
                shape.center.rotatePoint(op_degs, op_point);
                shape.border.rotatePoint(op_degs, op_point);
                break;

            case "Linha":
                shape.a.rotatePoint(op_degs, op_point);
                shape.b.rotatePoint(op_degs, op_point);
                break;

            case "Retângulo":
                shape.a.rotatePoint(op_degs, op_point);
                shape.b.rotatePoint(op_degs, op_point);
                shape.c.rotatePoint(op_degs, op_point);
                shape.d.rotatePoint(op_degs, op_point);
                break;

            case "Triângulo":
                shape.a.rotatePoint(op_degs, op_point);
                shape.b.rotatePoint(op_degs, op_point);
                shape.c.rotatePoint(op_degs, op_point);
                break;
        }
    }

    refreshTable();
    drawAll();
}

function selectShapes() {
    let numbs_str;

    actual_selection_elements = [];
    if(actual_id > -1){
        selection_string = selection_input.value;
        selection_string = selection_string === "" ? command_selection_string : selection_string;
        selection_string = selection_string.replace(/\s+/g, '');
        numbs_str = selection_string.split(",");
        selection_string = "";

        let num;
        for(let i = 0; i < numbs_str.length; i++){
            num = parseInt(numbs_str[i]);

            if(isNaN(num)){
                alert("O id inserido " + numbs_str[i] + " não é um ID válido");
                continue;
            }

            if(num > actual_id){
                alert("O id inserido " + num + " não é um ID válido");
                continue;
            }

            actual_selection_elements.push(num);
        }

        for(let i = 0; i < actual_selection_elements.length; i++){
            if(selection_elements.indexOf(actual_selection_elements[i]) === -1){
                selection_elements.push(actual_selection_elements[i]);
            }

            shapes[actual_selection_elements[i]].cor = '#ff0000'
        }

        drawAll();
    }
}

function deselectAllShapes(){
    for(let i = 0; i < selection_elements.length; i++){
        shapes[selection_elements[i]].cor = '#ffffff'
    }

    selection_elements = [];

    drawAll();
}

function windowToViewport(points){
    let uv;
    let xy;

    let ord_points = Point.findNearest(new Point (0, 0), points);


    if(points[0].y === ord_points[0].y){
        if(points[0].x === ord_points[0].x){
            window_start = points[0];
            window_end = points[2];
        }
        else{
            window_start = points[1];
            window_end = points[3];
        }
    }
    else{
        if(points[0].x === ord_points[0].x){
            window_start = points[3];
            window_end = points[1];
        }
        else{
            window_start = points[2];
            window_end = points[0];
        }
    }

    uv = Point.subPoints(viewport_end, viewport_start);
    xy = Point.subPoints(window_end, window_start);

    window_scale = new Point(uv.x/xy.x, uv.y/xy.y);

    drawAll();
}

//Funções de renderização

function startDraw(type){
    if(actual_drawing){
        endDrawing();
    }

    actual_drawing = type;
}

function drawPoint(x, y){
    context_main_canvas.beginPath();
    context_main_canvas.strokeStyle = '#ffffff';
    context_main_canvas.rect(x, y, 1, 1);
    context_main_canvas.stroke();
}

function addDrwaing(shape) {
    shapes.push(shape);
    updateTable(shape);
    endDrawing();
}

function endDrawing(){
    points = [];
    n_points = 0;
    is_zooming = false;

    drawAll();
}

function drawAll() {
    context_main_canvas.clearRect(0, 0, main_canvas.width, main_canvas.height);

    for(let i = 0; i < shapes.length; i++){
        shapes[i].draw(context_main_canvas, viewport_start, window_scale);
    }
}

function zoomAll() {
    context_main_canvas.clearRect(0, 0, main_canvas.width, main_canvas.height);

    for(let i = 0; i < shapes.length; i++){
        shapes[i].zoomPoints();
    }
}

function clearDrawings() {
    shapes = [];
    selection_elements = [];
    actual_drawing = 0;
    endDrawing();

    if(actual_id !== -1){
        clearTable();
    }

    actual_id = -1;

    clearWindowViewPort();
}

function updateTable(shape){
    let row = table_shapes.insertRow(1);
    row.setAttribute("id", "sh" + shape.id.toString());

    let id_cell = row.insertCell(0);
    let shape_cell = row.insertCell(1);
    let pontos_cell = row.insertCell(2);

    id_cell.innerHTML = shape.id;
    shape_cell.innerHTML = shape.name;
    pontos_cell.innerHTML = shape.getPontosString();
}

function clearTable(){
    let rows_length = table_shapes.rows.length;

    for(let i = 1; i < rows_length; i++){
        table_shapes.deleteRow(1);
    }
}

function refreshTable() {
    clearTable();

    for(let i = 0; i < shapes.length; i++){
        updateTable(shapes[i]);
    }
}

function zoomTo() {
    is_zooming = true;
    n_points = 0;
    points = [];
}

function zoomExtend() {
    const offset = 10;
    let l_x = Infinity;
    let l_y = Infinity;
    let h_x = -1;
    let h_y = -1;
    let next_x;
    let next_y;
    let elems = selection_elements;

    if(elems.length === 0){
        if(Point.compPoints(viewport_start, window_start) && Point.compPoints(viewport_end, window_end)){
            elems = [];
            for(let i = 0; i < shapes.length; i++){
                elems.push(i);
            }
        }
        else{
            l_x = viewport_start;
            h_x = viewport_end;
        }
    }
    if(elems.length !== 0){
        for (let i = 0; i < elems.length; i++) {
            next_x = shapes[elems[i]].findLowestHighestX();
            next_y = shapes[elems[i]].findLowestHighestY();

            if (next_x[0] < l_x) {
                l_x = next_x[0];
            }
            if (next_y[0] < l_y) {
                l_y = next_y[0];
            }

            if (next_x[1] > h_x) {
                h_x = next_x[1];
            }
            if (next_y[1] > h_y) {
                h_y = next_y[1];
            }
        }

        l_x = l_x > (viewport_start.x - offset + 1) ? l_x - offset : l_x;
        l_y = l_y > (viewport_start.y - offset + 1) ? l_y - offset : l_y;
        h_x = h_x < (viewport_end.x + offset + 1) ? h_x + offset : h_x;
        h_y = h_y < (viewport_end.y + offset + 1) ? h_y + offset : h_y;

        l_x = new Point(l_x, l_y);
        h_x = new Point(h_x, h_y);
    }

    extend_string = "zoom " + l_x.x + " " + l_x.y + " " + h_x.x + " " + h_x.y;
    executarComando();
    extend_string = "";
}

function showHelp() {
    alert("A primeira linha de botôes do painel da esquerda podem ser utilizados para criar novas formas, clique em" +
        " algum e clique no canvas para inserir os pontos das formas. A segunda linha são as transormações que podem ser" +
        " realizadas: Escala, Translação e rotação. Por fim, existe a opção de limpar o canvas. A seguir estão as funções" +
        " de zoom. A primeira é um zoom por definição de viewport por cliques no canvas, com 2 pontos clicados, o canvas" +
        " é redimensionado. Já a segunda opção é um zoom extend, onde, a partir dos objetos selecionados, o viewport é " +
        "dado a partir das dimensões dos objetos e então centralizado. Todas as " +
        "transformações são aplicadas em todos os objetos selecionados. Nas 3 caixas de texto " +
        "abaixo devem ser inseridas os parâmetros para as transformações (nem todas as transormações utilizam todas as " +
        "caixas) e as coordenadas devem sempre ser representadas por x,y. A caixa abaixo dessas é utilizada para selecionar " +
        "os objetos a partir dos IDs deles. Para selecionar múltiplos objetos, insira o ID de cada um separado por " +
        "uma vírgula e aperte o botão de seleção. O botão abaixo da caixa deseleciona todos os objetos. Por último, " +
        "existe a caixa de linha de comando, onde podem ser inseridas funções, as quais são executadas quando o " +
        "botão ao lado é pressionado");
    alert("As funções disponíveis por linha de comando são:\ncriarLinha posAx posAy posBx posBy\ncriaTriangulo posAx posAy posBx posBy " +
        "posCx posCy\ncriarRetangulo posAx posAy posBx posBy\ncriarCriculo posAx posAy posBordax posBorday" +
        "\nselecionarObjetos obj1,obj2,...\ndeselecionarTodos\nescalar posPx posPy sx sy\ntransladar dx dy" +
        "\nrotacionar posPx posPy graus\nlimparTudo\nzoom startX startY endX endY");
    alert("No painel do meio está o canvas que estão representadas graficamente as formas. Logo abaixo dele estão as" +
        "coordenadas atuais do ponteiro do mouse.");
    alert("O painel da direita contém a tabela de formas criadas, com seu ID, nome da forma e as coordenadas dos pontos" +
        " que representam o objeto.")
}

//Funções de lógica

function writeMessage(canvas, message, pos) {
    let context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '12pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, pos.x, pos.y);
}

function readArgs(as_float, type) {
    let str;
    let numbs_str;
    let numbs = [];

    if((type === 0) || (type === 2)) {
        if (command_point_string === "") {
            str = point_input.value.replace(/\s+/g, '');
        }
        else {
            str = command_point_string.replace(/\s+/g, '');
        }

        numbs_str = str.split(",");
        if(numbs_str[0] === "") numbs_str[0] = "0";

        if (numbs_str.length < 2) {
            numbs_str.push('0');
            numbs_str.push('0');
            alert("Quantidade de valores para ponto de operações incorreta, definindo como 0 as faltantes")
        }

        numbs.push(parseInt(numbs_str[0]));
        numbs.push(parseInt(numbs_str[1]));

        if (isNaN(numbs[0])) {
            alert("Coordenada(x) " + numbs_str[0] + " inválida, atribuindo como 0");
            numbs[0] = 0;
        }
        if (isNaN(numbs[1])) {
            numbs[1] = 0;
            alert("Coordenada(y) " + numbs_str[1] + " inválida, atribuindo como 0");
        }

        op_point = new Point(numbs[0], numbs[1]);
    }

    numbs = [];

    if((type === 0) || (type === 1)) {
        if (command_values_string === "") {
            str = values_input.value.replace(/\s+/g, '');
        }
        else {
            str = command_values_string.replace(/\s+/g, '');
        }

        numbs_str = str.split(",");
        if(numbs_str[0] === "") numbs_str[0] = "0";

        if (numbs_str.length < 2) {
            numbs_str.push('0');
            numbs_str.push('0');
            alert("Quantidade de valores para Translação/Escala incorreta, definindo como 0 as faltantes")
        }

        if (as_float) {
            numbs.push(parseFloat(numbs_str[0]));
            numbs.push(parseFloat(numbs_str[1]));
        }
        else {
            numbs.push(parseInt(numbs_str[0]));
            numbs.push(parseInt(numbs_str[1]));
        }

        if (isNaN(numbs[0])) {
            numbs[0] = 0;
            alert("Coordenada(x) " + numbs_str[0] + " inválida, atribuindo como 0");
        }
        if (isNaN(numbs[1])) {
            numbs[1] = 0;
            alert("Coordenada(y) " + numbs_str[1] + " inválida, atribuindo como 0");
        }

        op_values = new Point(numbs[0], numbs[1]);
    }

    if(type === 2) {
        if (command_degs_string === "") {
            str = degs_input.value;
        }
        else {
            str = command_degs_string;
        }

        op_degs = parseInt(str);

        if (isNaN(op_degs)) {
            op_degs = 0;
            alert("Valor de graus " + str + " inválido, atribuindo como 0");
        }
    }
}

function calcMousePos(canvas, x, y){
    let p;
    let rect = canvas.getBoundingClientRect();
    let new_x = Math.ceil(x - rect.left);
    let new_y = Math.ceil(y - rect.top);

    p = new Point(new_x, new_y).toWorldPos();

    return p;
}

function executarComando(){
    let command;
    let params;

    command = extend_string === "" ? command_input.value : extend_string;
    params = command.split(" ");

    if(command.startsWith("criarLinha")){
        actual_id = actual_id + 1;
        addDrwaing(new Line(new Point(parseInt(params[1]), parseInt(params[2])),
                            new Point(parseInt(params[3]), parseInt(params[4])), actual_id));
    }
    else if(command.startsWith("criarTriangulo")){
        actual_id = actual_id + 1;
        addDrwaing(new Triangle(new Point(parseInt(params[1]), parseInt(params[2])),
                                new Point(parseInt(params[3]), parseInt(params[4])),
                                new Point(parseInt(params[5]), parseInt(params[6])), actual_id));
    }
    else if(command.startsWith("criarRetangulo")){
        actual_id = actual_id + 1;
        addDrwaing(new Rectangle(new Point(parseInt(params[1]), parseInt(params[2])),
                                 new Point(parseInt(params[3]), parseInt(params[4])), actual_id));
    }
    else if(command.startsWith("criarCirculo")){
        actual_id = actual_id + 1;
        addDrwaing(new Circle(new Point(parseInt(params[1]), parseInt(params[2])),
                              new Point(parseInt(params[3]), parseInt(params[4])), actual_id));
    }
    else if(command.startsWith("selecionarObjetos")){
        command_selection_string = command.slice(18);

        selectShapes();
    }
    else if(command.startsWith("deselecionarTodos")){
        deselectAllShapes();
    }
    else if(command.startsWith("escalar")){
        command_point_string = params[1] + "," + params[2];
        command_values_string = params[3] + "," + params[4];
        rescale();
    }
    else if(command.startsWith("transladar")){
        command_values_string = params[1] + "," + params[2];
        translation();
    }
    else if(command.startsWith("rotacionar")){
        command_point_string = params[1] + "," + params[2];
        command_degs_string = params[3];
        rotateElem();
    }
    else if(command.startsWith("zoom")){
        let points = [new Point(parseInt(params[1]), parseInt(params[2])),
            new Point (parseInt(params[3]), parseInt(params[2])),
            new Point (parseInt(params[3]), parseInt(params[4])),
            new Point (parseInt(params[2]), parseInt(params[4]))];


        windowToViewport(points);
    }
    else if(command.startsWith("limparTudo")){
        clearDrawings();
    }
    else{
        alert("Comando inválido");
    }

}

function clearWindowViewPort(){
    viewport_start = new Point(0, 0);
    viewport_end = new Point(700, 700);
    viewport_dist = new Point(700, 700);
    window_start = new Point(0, 0);
    window_end = new Point(700, 700);
    window_scale = new Point(1, 1);
}

//Listeners

let make_point = function(evt){
    let mouse_canvas = mouse_pos.zoomPoint().toCanvasPos();
    if(is_zooming){
        points.push(mouse_pos);
        n_points = n_points + 1;

        drawPoint(mouse_canvas.x, mouse_canvas.y);

        if(n_points === 2){
            let w_points = [];

            w_points.push(points[0]);
            w_points.push(new Point(points[1].x, points[0].y));
            w_points.push(points[1]);
            w_points.push(new Point(points[0].x, points[1].y));

            n_points = 0;
            points = [];
            is_zooming = false;

            windowToViewport(w_points);
        }
    }
    else if(actual_drawing){

        points.push(mouse_pos);
        n_points = n_points + 1;

        drawPoint(mouse_canvas.x, mouse_canvas.y);

        if(n_points > 1) {
            switch (actual_drawing) {
                case 1:
                    if (n_points === 2) {
                        actual_id = actual_id + 1;
                        addDrwaing(new Line(points[0], points[1], actual_id));
                    }
                    break;
                case 2:
                    if (n_points === 3) {
                        actual_id = actual_id + 1;
                        addDrwaing(new Triangle(points[0], points[1], points[2], actual_id));
                    }
                    break;
                case 3:
                    if (n_points === 2) {
                        actual_id = actual_id + 1;
                        addDrwaing(new Rectangle(points[0], points[1], actual_id));
                    }
                    break;
                case 4:
                    if (n_points === 2) {
                        actual_id = actual_id + 1;
                        addDrwaing(new Circle(points[0], points[1], actual_id));
                    }
                    break;
            }
        }
    }
};

let read_mouse_pos = function(evt){
    mouse_pos = calcMousePos(main_canvas, evt.clientX, evt.clientY);
};

let write_coords = function(evt){
    let message = 'Coordenadas: x: ' + mouse_pos.x + ' y: ' + mouse_pos.y;

    writeMessage(coord_canvas, message, new Point(10, 25));
};

main_canvas.addEventListener('mousemove', read_mouse_pos);
main_canvas.addEventListener('mousemove', write_coords);
main_canvas.addEventListener('mousedown', make_point);

this.onload = function () {
    viewport_start = new Point(0, 0);
    viewport_end = new Point(700, 700);
    viewport_dist = new Point(700, 700);
    window_start = new Point(0, 0);
    window_end = new Point(700, 700);
    window_scale = new Point(1, 1);
};

//Utils

function toRadians (angle) {
    return angle * (Math.PI / 180);
}