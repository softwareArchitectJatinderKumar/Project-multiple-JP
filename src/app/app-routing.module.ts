import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactusComponent } from './views/pages/contactus/contactus.component';
import { JournalAboutComponent } from './views/pages/journal-about/journal-about.component';
import { submitManuScriptComponentModule } from './views/pages/submitManuScript/submitManuScript.module';
import { ManuScriptReportComponent } from './views/pages/ManuScriptReport/ManuScriptReport.component';
import { JournalFormComponent } from './views/pages/Journal-Publisher/NewJournal/NewJournal.component';
const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: ":Id/:name/SecurityIssue",
        loadChildren: () => import('./views/pages/SecurePasswordChange/SecurePasswordChange.module').then(m => m.SecurePasswordChangeComponentModule),
      },
      {
        path: "NewJournalForms",
        component: JournalFormComponent,
      },
      {
        path: "signup",
        loadChildren: () => import('./views/pages/new-registration-page/new-registration-page.module').then(m => m.NewRegistrationPageModule)
      },
      {
        path: ":Id/:name/signup",
        loadChildren: () => import('./views/pages/new-registration-page/new-registration-page.module').then(m => m.NewRegistrationPageModule)
      },
      {
        path: ':Id/:name/ExternalLogin',
        loadChildren: () => import('./views/pages/externalUser-login/externalUser-login.module').then(m => m.externalUserloginModule)
        // loadChildren: ()=> import('./views/pages/LoginWithRoles/LoginWithRoles.module').then(m=>m.LoginWithRolesModule)
      },
      {
        path: 'ExternalLogin',
        loadChildren: () => import('./views/pages/externalUser-login/externalUser-login.module').then(m => m.externalUserloginModule)
      },
      {
        path: 'Login',
        loadChildren: () => import('./views/pages/internalUser-login/internalUser-login.module').then(m => m.InternalUserLoginModule)
      },
      {
        path: ':Id/:name/Login',
        loadChildren: () => import('./views/pages/internalUser-login/internalUser-login.module').then(m => m.InternalUserLoginModule)
      },
      {
        path: '',
        loadChildren: () => import('./views/pages/journalhome/jouralhome.module').then(m => m.JournalhomeComponentModule)
      },
      {
        path: 'Home', redirectTo: ''
      },
      {
        path: 'Research',
        loadChildren: () => import('./views/pages/journalresearch/journalresearch.module').then(m => m.JournalresearchComponentModule)
      },
      {
        path: 'Conferences',
        loadChildren: () => import('./views/pages/journalconferences/journalconferences.module').then(m => m.JournalconferencesComponentModule)
      },
      {
        path: 'Contactus',
        component:ContactusComponent,
        // loadChildren: () => import('./views/pages/contactus/contactus.module').then(m => m.ContactusComponentModule)
      },
      {
        path: ':Id/:name/About',
        // component:JournalAboutComponent,
        loadChildren: () => import('./views/pages/journal-about/journal-about.component.mdoule').then(m => m.JournalAboutComponentModule)
      },
      {
        path: ':Id/:name/GetIssues',
        // component:JournalAboutComponent,
        loadChildren: () => import('./views/pages/JournalIssuesDetails/JournalIssuesDetails.module').then(m => m.JournalIssuesDetailsModule)
      },
      {
        path: ":Id/:name/EditorialBoard",
        loadChildren: () => import('./views/pages/journal-editor-board/journal-editor-board.component.module').then(m => m.JournalEditorBoardComponentModule)
      },
      {
        path: ":Id/:name/AuthorGuidelines/ManuScriptPrepare",
        loadChildren: () => import('./views/pages/AuthorGuidelines/manuscript-preparation/manuscript-preparation.component.module').then(m => m.ManuScriptPreparationComponentModule)
      },
      {
        path: ":Id/:name/AuthorGuidelines/ManuScriptWorkFlow",
        loadChildren: () => import('./views/pages/AuthorGuidelines/manuscript-workflow/manuscript-workflow.component.module').then(m => m.ManuScriptWorkflowComponentModule)
      },
      // Policies Routes
      {
        path: ":Id/:name/Policies/EditorialPolicy",
        loadChildren: () => import('./views/pages/JournalPolicies/editorial-policy/editorial-policy.component.module').then(m => m.EditorialPolicyComponentModule)
      },

      {
        path: ":Id/:name/Policies/PeerReviewPolicy",
        loadChildren: () => import('./views/pages/JournalPolicies/peer-review-policy/peer-review-policy.component.module').then(m => m.PeerReviewPolicyComponentModule)
      },

      {
        path: ":Id/:name/Policies/OpenAccessPolicy",
        loadChildren: () => import('./views/pages/JournalPolicies/open-access-policy/open-access-policy.component.module').then(m => m.OpenAccessPolicyComponentModule)
      },
      {
        path: ":Id/:name/Policies/PlagiarismPolicy",
        loadChildren: () => import('./views/pages/JournalPolicies/plagriasm-policy/plagrism-policy.component.module').then(m => m.PlagriasmPolicyComponentModule)
      },
      {
        path: ":Id/:name/Policies/PublicationChargePolicy",
        loadChildren: () => import('./views/pages/JournalPolicies/publication-charge-policy/publication-charge-policy.component.module').then(m => m.PublicationChargePolicyComponentModule)
      },

      {
        path: ":Id/:name/Policies/ComplaintPolicy",
        loadChildren: () => import('./views/pages/JournalPolicies/complaint-policy/complaint-policy.component.module').then(m => m.ComplaintPolicyComponentModule)
      },
      {
        path: ":Id/:name/Policies/CopyrightPolicy",
        loadChildren: () => import('./views/pages/JournalPolicies/copyrightand-licensingpolicy/copyrightand-licensingpolicy.component.module').then(m => m.CopyrightandLicensingpolicyComponentModule)
      },
      {
        path: ":Id/:name/Policies/ConflictInterestPolicy",
        loadChildren: () => import('./views/pages/JournalPolicies/interest-confilict-policy/interest-conflict-policy.component.module').then(m => m.InterestConfilictPolicyComponentModule)
      },

      {
        path: ":Id/:name/Policies/CorrectionsRetractionPolicy",
        loadChildren: () => import('./views/pages/JournalPolicies/corection-retraction-policy/corection-retraction-policy.component.module').then(m => m.CorectionRetractionPolicyComponentModule)
      },
      {
        path: ":Id/:name/Policies/CrossMarkPolicy",
        loadChildren: () => import('./views/pages/JournalPolicies/cross-mark-policy/cross-mark-policy.component.module').then(m => m.CrossMarkPolicyComponentModule)
      },

      {
        path: ":Id/:name/Policies/DigitalandSelfPolicy",
        loadChildren: () => import('./views/pages/JournalPolicies/digital-self-archiving-policy/digital-self-archiving-policy.component.module').then(m => m.DigitalSelfArchivingPolicyComponentModule)
      },
      {
        path: ":Id/:name/SubmitManuScript",
        // component:SubmitManuScriptComponentModule
        loadChildren: () => import('./views/pages/submitManuScript/submitManuScript.module').then(m => m.submitManuScriptComponentModule)
      },
      {
        path: ":Id/:name/MyManuScript",
        component: ManuScriptReportComponent,
        // component:SubmitManuScriptComponentModule
        // loadChildren: () => import('./views/pages/SubmitManuScript/SubmitManuScript.module').then(m => m.SubmitManuScriptComponentModule)
      },


      // Publisher Dashboard
    
      {
        path:'AdvancedLogin',
        loadChildren: ()=> import('./views/pages/internalUser-login/internalUser-login.module').then(m=>m.InternalUserLoginModule)
      },
       //  // Journal WebAdmin Panel
       {
        path:'UpdateJournalsDetails',
        loadChildren:()=> import('./views/pages/Journal-Publisher/update-journal-details/update-journal-details.module').then(m=> m.UpdateJournalDetailsModule)
      },
      {
        path: "PublisherDashboard",
        loadChildren: () => import('./views/pages/Journal-Publisher/Publisher-Dashboard/Publisher-Dashboard.module').then(m=>m.PublisherDashboardModule)
      },
      {
        path: "AllJournals",
        loadChildren: () => import('./views/pages/Journal-Publisher/All-Journals-Details/All-Journals-Details.module').then(m=>m.AllJournalsDetailsModule)
      },
      {
        path: ":Menu/:Role/AllUsersDetails",
        loadChildren: () => import('./views/pages/Journal-Publisher/All-User-Details/All-User-Details.module').then(m=>m.AllUserDetailsModule)
      },
      {
        path: "AllUsersDetails",
        loadChildren: () => import('./views/pages/Journal-Publisher/All-User-Details/All-User-Details.module').then(m=>m.AllUserDetailsModule)
      },


// Editors Dashboard 
      {
        path: "EditorDashboard",
        loadChildren: () => import('./views/pages/Journal-Editors-AdminDashboard/Manuscript-Details/Manuscript-Details.module').then(m=>m.ManuscriptDetailsModule)
      },
      {
        path: "ReviewersRemarks",
        loadChildren: () => import('./views/pages/Journal-Editors-AdminDashboard/ReviewersRemarks-Details/ReviewersRemarks-Details.module').then(m=>m.ReviewersRemarksDetailsModule)
      },

      {
        path: "UpdateKey",
        loadChildren: () => import('./views/pages/Journal-Editors-AdminDashboard/Change-Password/Change-Password.module').then(m=>m.ChangePasswordComponentModule)
      },
      {
        path:"NewVolume",
        loadChildren:() => import('./views/pages/Journal-Editors-AdminDashboard/AddNewVolumeIssue/NewJournalVolumeIssues/NewJournalVolumeIssues.module').then(m=>m.NewJournalVolumeIssuesModule)
      },
      {
        path:"AllVolumesIssues",
        loadChildren:() => import('./views/pages/Journal-Editors-AdminDashboard/ViewAllJournalIssues/ViewAllJournalIssues.module').then(m=>m.ViewAllJournalIssuesModule)
      },
      {
        path:"EditIssueDetails",
        loadChildren:() => import('./views/pages/Journal-Editors-AdminDashboard/UpdateIssueDetails/UpdateIssueDetails.module').then(m=>m.UpdateIssueDetailsModule)
      },
      {
        path:"ManageEditorDetails",
        loadChildren:() => import('./views/pages/Journal-Editors-AdminDashboard/Crud-Editor-Details/editor-crud.module').then(m=>m.EditorCrudModule)
      },


      // Reviewers Dashboard 
      {
        path: "ReviewersDashboard",
        loadChildren: () => import('./views/pages/Journal-Reviewers-AdminDashboard/MyManuscript-Details/MyManuscript-Details.module').then(m=>m.MyManuscriptDetailsModule)
      },
      {
        path: "MyReviews",
        loadChildren: () => import('./views/pages/Journal-Reviewers-AdminDashboard/MyRemarks-Details/MyRemarks-Details.module').then(m=>m.MyRemarksDetailsModule)
      },



      // Recover Password
      {
        path: ":Id/:name/RecoverPasswordReset",
        // loadChildren: () => import('./views/pages/Journal-Editors-AdminDashboard/Manuscript-Details/Manuscript-Details.module').then(m=>m.ManuscriptDetailsModule)
        loadChildren: () => import('./views/pages/recover-account/recover-account.module').then(m=>m.RecoverAccountComponentModule),
      }, 


      // // Recover Password
      // {
      //    path: ":Id/:name/RecoverPasswordReset",
      //   // loadChildren: () => import('./views/pages/Journal-Editors-AdminDashboard/Manuscript-Details/Manuscript-Details.module').then(m=>m.ManuscriptDetailsModule)
      //   loadChildren: () => import('./views/pages/recover-account/recover-account.module').then(m=>m.RecoverAccountComponentModule),
      // }, 


      // User Editor Dashboard  added on 12-May-25
      {
        path:':Id/:name/RolewiseLogin',
        loadChildren: ()=> import('./views/pages/LoginWithRoles/LoginWithRoles.module').then(m=>m.LoginWithRolesModule)
      },
      {
        path: ":Id/:name/UserED",
        loadChildren: () => import('./views/pages/RoleWise-Dashboard/EditorDashboard/EDManuscript-Details/EDManuscript-Details.module').then(m=>m.EDManuscriptDetailsModule)
      },
      {
        path: ":Id/:name/UserRRD",
        loadChildren: () => import('./views/pages/RoleWise-Dashboard/EditorDashboard/EDReviewersRemarks-Details/EDReviewersRemarks-Details.module').then(m=>m.EDReviewersRemarksDetailsModule)
      },
      {
        path: ":Id/:name/EDNewIssue",
        // loadChildren: () => import('./views/pages/RoleWise-Dashboard/EditorDashboard/AddNewVolumeIssue/NewJournalVolumeIssues/EDNewJournalVolume.module').then(m=>m.EDNewJournalVolumeModule)
        loadChildren: () => import('./views/pages/RoleWise-Dashboard/EditorDashboard/AddNewVolumeIssue/NewLogic-AddNewIssue/AddNewIssuePage.module').then(m=>m.AddNewIssuePageModule)
      },
      {
        path: ":Id/:name/EDAllssues",
        loadChildren: () => import('./views/pages/RoleWise-Dashboard/EditorDashboard/ViewAllJournalIssues/EDAllJournalVolumes.module').then(m=>m.EDAllJournalVolumesModule)
      },
      // {
      //   path: "ReviewersRemarks",
      //   loadChildren: () => import('./views/pages/Journal-Editors-AdminDashboard/ReviewersRemarks-Details/ReviewersRemarks-Details.module').then(m=>m.ReviewersRemarksDetailsModule)
      // },


      // User Author Dashboard 
      {
        path :":Id/:name/AuthorDashboard",
        loadChildren:()=> import('./views/pages/RoleWise-Dashboard/AuthorDashboard/NewManuscript/NewManuScript.module').then(m=>m.NewManuScriptModule)
      },
      {
        path :":Id/:name/ViewManuscripts",
        loadChildren:()=> import('./views/pages/RoleWise-Dashboard/AuthorDashboard/ManuScriptReport/ViewAllManuscripts.module').then(m=>m.ViewAllManuscriptsModule)
      },
      // Reviewers Dashboard 
      {
        path :":Id/:name/ReviewerDashboard",
        loadChildren:()=> import('./views/pages/RoleWise-Dashboard/ReviewersDashboard/RDManuscript-Details/RDManuscript-Details.module').then(m=>m.RDManuscriptDetailsModule)
      },
      {
        path :":Id/:name/ReviewersRemarks",
        loadChildren:()=> import('./views/pages/RoleWise-Dashboard/ReviewersDashboard/RDRemarksDetails/RDRemarksDetails.module').then(m=>m.RDRemarksDetailsModule)
      },
      {
        path :":Id/:name/ForgotPassword",
        // loadChildren: () => import('./views/pages/recover-account/recover-account.module').then(m=>m.RecoverAccountComponentModule),
        loadChildren: () => import('./views/pages/ForgotPassword/ForgotPassword.module').then(m=>m.ForgotPasswordModule),
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }