import { Component, OnInit } from '@angular/core';
import { TextractApiService } from '../service/textract-api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  studentsInSystem: any[] = [
    {studentNum: "17000000", name: "IS Tester"}
  ];
  newStudent: any;

  constructor(private textractService: TextractApiService) { }
 
  ngOnInit(): void {
  }

  file: File | undefined;
  fileName: string | undefined;
  
  onSelect(event: { addedFiles: any; }) {
    console.log(event.addedFiles);
    this.file = event.addedFiles;
    this.fileName = event.addedFiles[0].name;
  }

  onRemove(file: File){
    this.file = undefined;
  }

  async uploadID(){
    if (!this.file) {
        alert('Please add a file');
        return;
    }
    
    await this.textractService.uploadID(this.file);
    
    setTimeout(async () =>{ 
      this.newStudent = await this.textractService.returnStudent();
      console.log(this.newStudent);
      this.studentsInSystem.push(this.newStudent);
    }, 10000);
  }
}
