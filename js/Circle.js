class Circle{
    constructor(center, border, id){
        this.id = id;
        this.name = "Circulo";
        this.cor = '#ffffff';

        this.center = center;
        this.radius = Point.calcDist(center, border);
        this.border = border;
    }

    findNearest(p){
        this.setBorderAsLowest();

        return this.border;
    }

    setBorderAsLowest(){
        let cos;
        let sin;

        cos = Point.dotProduct(new Point(1, 0), this.center);
        cos = cos/Point.calcDist(this.center, new Point(0, 0));

        sin = 1 - Math.pow(cos, 2);

        this.border = new Point(Math.ceil(this.center.x+this.radius*cos),
            Math.ceil(this.center.y+this.radius*sin));
    }

    findLowestHighestX(){
        return [this.center.x-this.radius, this.center.x+this.radius];
    }
    findLowestHighestY(){
        return [this.center.y-this.radius, this.center.y+this.radius];
    }

    zoomPoints(){
        this.center.zoomPoint();
        this.border.zoomPoint();
        this.radius = Point.calcDist(this.center, this.border);
    }

    draw(context){
        let n_center = this.center.zoomPoint();
        let n_border = this.border.zoomPoint();
        let n_radius = Point.calcDist(n_center, n_border);

        context.beginPath();
        context.arc(n_center.toCanvasPos().x, n_center.toCanvasPos().y, n_radius, 0, 2*Math.PI);
        context.strokeStyle = this.cor;
        context.stroke();
    }

    getPontosString(){
        return "(C: " + this.center.x + ", " + this.center.y + "; R: " + this.radius + ")";
    }
}