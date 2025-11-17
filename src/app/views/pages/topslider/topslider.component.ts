import { Component } from '@angular/core';

@Component({
    selector: 'app-topslider',
    templateUrl: './topslider.component.html',
    styleUrls: ['./topslider.component.scss'], standalone: false
})
export class TopsliderComponent {
    slideText="OPEN ACCESS JOURNAL";
    slides = [
        { text: "OPEN ACCESS JOURNAL" },
        { text: "OPEN ACCESS JOURNAL" },
    ];
    slideConfig = {
        "slidesToShow": 1,
        "slidesToScroll": 1,
        "autoplay": true,
        "autoplaySpeed": 5000,
        "pauseOnHover": true,
        "infinite": true,
        "responsive": [
            {
                "breakpoint": 992,
                "settings": {
                    "arrows": true,
                    "infinite": true,
                    "slidesToShow": 3,
                    "slidesToScroll": 3
                }
            },
            {
                "breakpoint": 756,
                "settings": {
                    "arrows": true,
                    "infinite": true,
                    "slidesToShow": 1,
                    "slidesToScroll": 1
                }
            }
        ]
    };
}
