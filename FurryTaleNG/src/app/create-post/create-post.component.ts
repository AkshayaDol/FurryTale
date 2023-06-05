import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {CreatePostService} from '../create-post.service'
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from '../posts';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit{
  selectedOption: Number = -1;
  paws : String[];
  post : Post;
  isRecruiter : boolean = false;
  //userId : String = "2c78a513a28f2bf1c680b505955a7bad";
  userId : String = "";

  options = [
    { id: -1, name: "-- Select --" },
    { id: 0, name: "Fun" },
    { id: 2, name: "Adoption" },
    { id: 3, name: "Training" },
    {id : 4, name: "Competitions"}
  ];

  constructor(private http: HttpClient, private route: ActivatedRoute, private createPostService: CreatePostService, private router: Router) {
    this.paws = [];
    this.post = {
      postId : "1",
      userId : this.userId,
      postType : 1,
      image : "",
      caption: "",
      paws : this.paws
    }
   }
  
  ngOnInit(): void {
    /*
    this.route.queryParams.subscribe((params) =>{
      console.log(params)
      if(params['userId'].length !== 0){
        this.userId = params['userId']
          this.post.userId = params['userId'];
      }
  }
    );
    */

    this.createPostService.getCurrentUser().subscribe((res : any) => {
      if(res.authentication !== undefined){
        this.router.navigateByUrl('/');
      }
      console.log("printing user info from create post angular");
      console.log(res);
      console.log("userId from angular create post is "+res.userId);
      this.userId = res.userId;
      this.post.userId = res.userId;

      this.createPostService.getCurrentUserAccount().subscribe((accountType : any) => {
        console.log("account type from angular create post is "+accountType);
        if(accountType === 2){
          this.options.push( { id: 1, name: "Job" })
        }
      });
    });
    

}
  onSubmit(form: NgForm) {
    this.post.postType = this.selectedOption;
    console.log(this.post);
    this.createPostService.createNewPost(this.post).subscribe((result : any) => {
      this.router.navigateByUrl('/home');
    })
    
  }
}