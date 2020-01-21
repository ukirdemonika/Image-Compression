import { Component, OnInit } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-compress',
  templateUrl: './compress.component.html',
  styleUrls: ['./compress.component.css']
})
export class CompressComponent implements OnInit {

  uploadedImage: File;
  imagePreview: string;
  fileUrl;
  selected_file=null;
  selected_file_name=null;
  selected_val=null;
  image_size=null;

  width;
  height;
  imgURL: any;
  public message: string;
  public imagePath;

  percentages = [
   { id: 1, name: "10%", value:[0.001]},
  { id: 2, name: "20%", value:[0.0075]},
  { id: 3, name: "40%" ,value:[0.0050]},
  { id: 4, name: "60%",value:[0.0025]}
    ];

  thumbnails = [
  { id: 1, name: "160x160" ,value:[160,160]},
  { id: 2, name: "160x108" ,value:[160,108]},
  { id: 3, name: "160x120",value:[160,120] },
  { id: 4, name: "120x80",value:[120,80] },
  { id: 5, name: "100x100",value:[100,100] },
  { id: 6, name: "75x75",value:[75,75] }
   ];

  public onChangePer(event): void {  // event will give you full breif of action

    const newVal = event.target.value;
    for(var i=0;i<this.percentages.length;i++){
      if (this.percentages[i].id==newVal){
        this.selected_val=this.percentages[i].value;

      }
    }

  }

  public onChangeThumb(event): void {  // event will give you full breif of action

    const newVal = event.target.value;
    for(var i=0;i<this.thumbnails.length;i++){
      if (this.thumbnails[i].id==newVal){
        this.selected_val=this.thumbnails[i].value;


        this.width=this.selected_val[0];
        this.height=this.selected_val[1];

      }
    }
  }

  /*onFileSelected(event){

    this.selected_file=event.target.files[0].name;
    this.selected_path=URL.createObjectURL(event.target.files[0]);
    console.log(this.selected_path);
    this.selected=true;
  }*/

  preview(files) {
    if (files.length === 0)
      return;
       this.selected_file=files[0];
        this.selected_file_name=files[0].name;
        this.image_size=files[0].size;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }


  onImageChange(image) {
    if(this.selected_val.length==1){
        console.log(this.selected_val);
         this.ng2ImgMax.compressImage(image,this.selected_val).subscribe(
      result => {
        this.uploadedImage = new File([result], result.name);
        console.log("upload image");
         console.log(this.uploadedImage);
        this.getImagePreview(this.uploadedImage);
      },
      error => {
        console.log('Oh no!', error);
      }
       );
    }

    else if(this.selected_val.length==2){
         this.ng2ImgMax.resizeImage(image, this.width, this.height).subscribe(
    result => {
      this.uploadedImage = new File([result], result.name);
        this.getImagePreview(this.uploadedImage);
    },
    error => {
      console.log('Oh no!', error);
    }
    );
    }

  }

  getImagePreview(file: File) {
    console.log("In image preview");
    console.log(file);

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagePreview = reader.result as string;

    };
  }
   download(){
      const data ="some text";
      const blob = new Blob([data], { type: 'application/octet-stream' });
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL( this.uploadedImage));

   }
  constructor(
    private ng2ImgMax: Ng2ImgMaxService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {

  }

}
