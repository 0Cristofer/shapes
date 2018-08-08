class Rectangle{
    constructor(a, c, id){
        this.id = id;
        this.name = "Retângulo";
        this.cor = '#ffffff';

        this.a = a;
        this.b = new Point(c.x, a.y);
        this.c = c;
        this.d = new Point(a.x, c.y);

        this.near_origin = this.findNearest();
    }

    findNearest(p){
        let dist;
        let shortest;
        let nearest;

        if(!p){
            p = new Point(0, 0);
        }

        shortest = Point.calcDist(this.a, p);
        nearest = this.a;

        dist = Point.calcDist(this.b, p);
        if(shortest > dist){
            shortest = dist;
            nearest = this.b;
        }

        dist = Point.calcDist(this.c, p);
        if(shortest > dist){
            shortest = dist;
            nearest = this.c;
        }

        dist = Point.calcDist(this.d, p);
        if(shortest > dist){
            nearest = this.d;
        }

        return nearest;
    }

    findLowestHighestX(){
        let lowest = this.a.x;
        let highest = this.a.x;

        if(this.b.x < lowest){
            lowest = this.b.x;
        }
        if(this.b.x > highest){
            highest = this.b.x;
        }

        if(this.c.x < lowest){
            lowest = this.c.x;
        }
        if(this.c.x > highest){
            highest = this.c.x;
        }

        if(this.d.x < lowest){
            lowest = this.d.x;
        }
        if(this.d.x > highest){
            highest = this.d.x;
        }

        return [lowest, highest];
    }

    findLowestHighestY(){
        let lowest = this.a.y;
        let highest = this.a.y;

        if(this.b.y < lowest){
            lowest = this.b.y;
        }
        if(this.b.y > highest){
            highest = this.b.y;
        }

        if(this.c.y < lowest){
            lowest = this.c.y;
        }
        if(this.c.y > highest){
            highest = this.c.y;
        }

        if(this.d.y < lowest){
            lowest = this.d.y;
        }
        if(this.d.y > highest){
            highest = this.d.y;
        }

        return [lowest, highest];
    }

    zoomPoints(){
        this.a.zoomPoint();
        this.b.zoomPoint();
        this.c.zoomPoint();
        this.d.zoomPoint();
    }

    draw(context){
        context.beginPath();
        context.moveTo(this.a.zoomPoint().toCanvasPos().x, this.a.zoomPoint().toCanvasPos().y);
        context.lineTo(this.b.zoomPoint().toCanvasPos().x, this.b.zoomPoint().toCanvasPos().y);
        context.lineTo(this.c.zoomPoint().toCanvasPos().x, this.c.zoomPoint().toCanvasPos().y);
        context.lineTo(this.d.zoomPoint().toCanvasPos().x, this.d.zoomPoint().toCanvasPos().y);
        context.lineTo(this.a.zoomPoint().toCanvasPos().x, this.a.zoomPoint().toCanvasPos().y);
        context.strokeStyle = this.cor;
        context.stroke();
    }

    getPontosString(){
        return "(A: " + this.a.x + ", " + this.a.y +
              "; B: " + this.b.x + ", " + this.b.y +
              "; C: " + this.c.x + ", " + this.c.y +
              "; D: " + this.d.x + ", " + this.d.y + ")";
    }
}