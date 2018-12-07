class DrawableObject{
    constructor(points, id, name, center){
        this.id = id;
        this.points = points;
        this.name = name;
        this.cor = '#000000';

        if(center === undefined){
            this.center = false;
        }
        else{
            this.center = center;
        }
    }

    translate(dist, p){
        for(let i = 0; i < this.points.length; i++){
            this.points[i].translateTo(dist);
        }
    }

    scale(sx, sy, p){
        for(let i = 0; i < this.points.length; i++){
            this.points[i].scaleRelativeTo(sx, sy, p);
        }
    }

    rotate(degs, axis){
        for(let i = 0; i < this.points.length; i++){
            this.points[i].rotatePoint(degs, axis);
        }
    }

    findLowestHighestX(){
        let lowest = this.points[0].x;
        let highest = this.points[0].x;

        for(let i = 1; i < this.points.length; i++){
            if(this.points[i].x < lowest){
                lowest = this.points[i].x;
            }

            if(this.points[i].x > highest){
                highest = this.points[i].x;
            }
        }

        return [lowest, highest];
    }

    findLowestHighestY(){
        let lowest = this.points[0].y;
        let highest = this.points[0].y;

        for(let i = 1; i < this.points.length; i++){
            if(this.points[i].y < lowest){
                lowest = this.points[i].y;
            }

            if(this.points[i].y > highest){
                highest = this.points[i].y;
            }
        }

        return [lowest, highest];
    }

    draw(context){
        let canvas_point = this.points[0].zoomPoint().toCanvasPos();

        context.beginPath();

        context.moveTo(canvas_point.x, canvas_point.y);
        for(let i = 1; i < (this.points.length+1); i++){
            canvas_point = this.points[i%this.points.length].zoomPoint().toCanvasPos();
            context.lineTo(canvas_point.x, canvas_point.y);
        }

        context.strokeStyle = this.cor;
        context.stroke();
    }

    getPointsString(){
        let str = "(";

        if(this.center){
            str = str + "C: " + this.center.x + ", " + this.center.y + "; R: " + this.points[0].x +  ", " + this.points[0].y;
        }
        else {
            for (let i = 0; i < this.points.length; i++) {
                str = str + i + ": " + this.points[i].x + ", " + this.points[i].y + "; "
            }
        }

        str = str + ")";

        return str;
    }

    duplicate(){
        let n_points = [];

        for(let i = 0; i < this.points.length; i++){
            n_points.push(this.points[i].duplicate());
        }

        return new DrawableObject(n_points, this.id, this.name, this.center);
    }

    static createRectangle(p1, p2){
        let points = [];

        points.push(p1);
        points.push(new Point(p2.x, p1.y));
        points.push(p2);
        points.push(new Point(p1.x, p2.y));

        return points;
    }

    static createCircle(center, border, circle_sides){
        let point;
        let points = [];
        let actual_deg = 0;
        let radius = Point.calcDist(center, border);

        for(let i = 0; i < circle_sides; i++){
            point = new Point(Math.ceil(center.x + radius*Math.cos(toRadians(actual_deg))),
                Math.ceil(center.y + radius*Math.sin(toRadians(actual_deg))));
            points.push(point);

            actual_deg = actual_deg + 360/circle_sides;
        }

        return points;
    }
}