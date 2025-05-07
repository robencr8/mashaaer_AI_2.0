; Custom NSIS script for Mashaaer Enhanced installer
; This script adds custom branding and behavior to the installer

!macro customHeader
    ; Add custom header image or branding
    !define MUI_HEADERIMAGE
    !define MUI_HEADERIMAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Header\nsis3-metro.bmp"
    !define MUI_HEADERIMAGE_UNBITMAP "${NSISDIR}\Contrib\Graphics\Header\nsis3-metro.bmp"
    
    ; Custom welcome page
    !define MUI_WELCOMEFINISHPAGE_BITMAP "installer-background.png"
    !define MUI_UNWELCOMEFINISHPAGE_BITMAP "installer-background.png"
    
    ; Custom colors
    !define MUI_BGCOLOR F0F0F0
    !define MUI_TEXTCOLOR 000000
!macroend

!macro customWelcomePage
    ; Custom welcome page text
    !define MUI_WELCOMEPAGE_TITLE "Welcome to Mashaaer Enhanced Setup"
    !define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of Mashaaer Enhanced, the advanced Arabic voice assistant with emotion detection and smart personal assistance capabilities.$\r$\n$\r$\nClick Next to continue."
!macroend

!macro customInstallDir
    ; Set default install directory
    InstallDir "$PROGRAMFILES\Mashaaer Enhanced"
!macroend

!macro customInstallMode
    ; Installation mode
    !define MULTIUSER_EXECUTIONLEVEL Highest
    !define MULTIUSER_MUI
    !define MULTIUSER_INSTALLMODE_COMMANDLINE
!macroend

!macro customFinishPage
    ; Custom finish page
    !define MUI_FINISHPAGE_TITLE "Mashaaer Enhanced Installation Complete"
    !define MUI_FINISHPAGE_TEXT "Mashaaer Enhanced has been installed on your computer.$\r$\n$\r$\nClick Finish to close this wizard."
    !define MUI_FINISHPAGE_RUN "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
    !define MUI_FINISHPAGE_RUN_TEXT "Launch Mashaaer Enhanced"
    !define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\README.txt"
    !define MUI_FINISHPAGE_SHOWREADME_TEXT "View README file"
!macroend

!macro customInit
    ; Custom initialization
    Function .onInit
        ; Show splash screen during installation
        InitPluginsDir
        File /oname=$PLUGINSDIR\splash.png "splash.png"
        splash::show 3000 $PLUGINSDIR\splash.png
        Pop $0
    FunctionEnd
!macroend

!macro customUnInit
    ; Custom uninstallation
    Function un.onInit
        MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "Are you sure you want to completely remove Mashaaer Enhanced and all of its components?" IDYES +2
        Abort
    FunctionEnd
!macroend