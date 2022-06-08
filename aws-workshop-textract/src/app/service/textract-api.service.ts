import { Injectable } from '@angular/core';
import { AnalyzeDocumentCommand } from  "@aws-sdk/client-textract";
import  { TextractClient } from "@aws-sdk/client-textract";

import * as S3 from 'aws-sdk/clients/s3';

const REGION = "us-east-1";
const CREDENTIALS = {
  accessKeyId: '', 
  secretAccessKey: '',
};

const textractClient = new TextractClient({ region: REGION, credentials: CREDENTIALS});
const s3Client = new S3({region: REGION, credentials: CREDENTIALS});

const bucket = 'aws-workshop-student-ids-database';

@Injectable({
  providedIn: 'root'
})
export class TextractApiService {
  textractData: any;
  newStudent: any;

  constructor() { }

  async analyzeID(fileName: any){
    const params = {
      Document: {
        S3Object: {
          Bucket: bucket,
          Name: fileName
        },
      },
      FeatureTypes: ["FORMS"],
    }
    
    try {
      const analyzeDoc = new AnalyzeDocumentCommand(params);
      const response = await textractClient.send(analyzeDoc);

      return response;
      
    } catch (err) {
      console.log("Error", err);
      return null;
    }

  }

  async uploadID(file: any) {
    const contentType = file[0].type;
  
    const params = {
      Bucket: bucket,
      Key: file[0].name,
      Body: file[0],
      ACL: 'public-read',
      ContentType: contentType
    };

    s3Client.upload(params, (err: any, data: any) =>{
      if (err) {
        console.log('There was an error uploading your file: ', err);
      }
      console.log('Successfully uploaded file.', data);
    });

    setTimeout(async () =>{ 
      this.textractData = await this.analyzeID(file[0].name);
      console.log(this.textractData.Blocks);
      this.newStudent = {
        studentNum: this.textractData.Blocks[19].Text,
        name: this.textractData.Blocks[17].Text + " " + this.textractData.Blocks[18].Text
      }
    }, 5000);
  }


  returnStudent(){
    return this.newStudent;
  }
}

