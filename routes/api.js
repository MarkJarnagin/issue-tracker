'use strict';

const shortid = require('shortid');
// var expect = require('chai').expect;
// var MongoClient = require('mongodb');
// var ObjectId = require('mongodb').ObjectID;

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

// OUR MASTER DB
let issues = [];

module.exports = function (app) {

  app.route('/api/issues/')
  
    .get(function (req, res){
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.query;
    
      let filteredIssues = [...issues];
    
      if(_id) {
        filteredIssues = filteredIssues.filter(issue => issue._id === _id);
      }
    
      if(issue_title) {
        filteredIssues = filteredIssues.filter(issue => issue.issue_title === issue_title);
      }
    
      if(issue_text) {
        filteredIssues = filteredIssues.filter(issue => issue.issue_text === issue_text);
      }
    
      if(created_by) {
        filteredIssues = filteredIssues.filter(issue => issue.created_by === created_by);
      }
    
      if(assigned_to) {
        filteredIssues = filteredIssues.filter(issue => issue.assigned_to === assigned_to);
      }
    
      if(status_text) {
        filteredIssues = filteredIssues.filter(issue => issue.status_text === status_text);
      }
    
      if(open) {
        open = (open === 'false') ? false : true;
        filteredIssues = filteredIssues.filter(issue => issue.open === open);
      }
    
      return res.json(filteredIssues);
    })
    
    .post(function (req, res){
     const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
     
      const newIssue = {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        created_on: newDate(),
        updated_on: newDate(),
        open: true,
        _id: shortid.generate()
      } 

      issues.push(newIssue);

      res.json(newIssue);
    })
    
    .put(function (req, res){
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

      let updated = false; 

      if(!issue_title && !issue_text && !created_by, !assigned_to && !status_text && !open) {

      }

      // map over the issues and change where _id from the issue is === _id provided
      issues = issues.map(issue => {
        if(issue._id === _id){
          const { created_on } = issue;
          
          updated = true;

          return {
            _id,
            created_on,
            updated_on: new Date(),
            created_by: created_by !== '' ? created_by : issue.created_by, 
            issue_title: issue_title !== '' ? issue_title : issue.issue_title,
            issue_text: issue_text !== '' ? issue_text : issue.issue_text,
            assigned_to: assigned_to !== '' ? assigned_to : issue.assigned_to,
            status_text: status_text !== '' ? status_text : issue.status_text,
            open: open === undefined ? false : true 
          }
        }

        return  issue; 
      });

      if(!updated) {
        return res.json({
          "error": `Could not update '${_id}' - incorrect ID.`
        })
      }

      console.log('Edited', issues);

      res.json({
        "success": "Updated successfully"
      });

    })
    
    .delete(function (req, res){
      const { _id } = req.body;
    
      if(!_id) {
        return res.json({
          "error": "No _id provided"
        })
      }
    
      const lenBefore = issues.length;
    
      // filter out the issue with _id === _id provided
      issues = issues.filter(issue => issue._id !== _id);
    
      const lenAfter = issues.length;
    
    
      console.log('Deleted', issues);
    
      // successfully deleted
      if(lenBefore !== lenAfter) {
        return res.json({
          "success": `Deleted _id: ${_id}`
        });
      } else {
        return res.json({
          "error": `Could not delete`
        });
      }
      
    });
    
};
