pipeline {
    environment {
    registry = "nqvietuit/thesis-server"
    registryCredential = 'dockerhub'
    dockerImage = ''
    middleVerion = 1
    version = 1
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
                    if(BUILD_NUMBER > 10){
                        middleVerion = middleVerion + 1
                    }
                    script {
                        dockerImage = docker.build registry + ":v$version.$middleVersion.$BUILD_NUMBER"
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
                  sh "docker rmi --force $registry:$BUILD_NUMBER"
                  sh "docker rmi --force $registry:latest"
                }
            }
        }
    }