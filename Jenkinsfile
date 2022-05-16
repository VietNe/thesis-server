pipeline {
    environment {
        registry = "nqvietuit/thesis-server"
        registryCredential = 'dockerhub'
        dockerImage = ''
    }

    agent any
    stages {
            stage('Cloning our Git') {
                steps {
                    git branch: 'main', url: 'https://github.com/VietNe/thesis-server.git'
                }
            }

            stage('Building Docker Image') {
                steps {
                    script {
                        dockerImage = docker.build registry + ":v1.$BUILD_NUMBER"
                    }
                }
            }

            stage('Deploying Docker Image to Dockerhub') {
                steps {
                    script {
                        docker.withRegistry('', registryCredential) {
                            dockerImage.push()
                            dockerImage.push('latest')
                        }
                    }
                }
            }

            stage('Cleaning Up') {
                steps{
                  sh "docker rmi --force $registry:v1.$BUILD_NUMBER"
                  sh "docker rmi --force $registry:latest"
                }
            }

            stage ('Deploy K3S') {
             steps {
                     withCredentials([string(credentialsId: "argo-deploy", variable: 'ARGOCD_AUTH_TOKEN')]) {
                        sh '''
                        ARGOCD_SERVER="35.186.156.123:31904"
                        APP_NAME="aqi-server"
                        ARGO_INSECURE=true
                        
                        # Deploy to ArgoCD
                        ARGOCD_SERVER=$ARGOCD_SERVER argocd --grpc-web app sync $APP_NAME --force
                        ARGOCD_SERVER=$ARGOCD_SERVER argocd --grpc-web app wait $APP_NAME --timeout 600
                        '''
               }
            }
        }
        }
    }