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

            stage('Update GIT') {
                script {
                    withCredentials([string(credentialsId: "github-token", variable: 'GITHUB_TOKEN')]) {
                        sh "git config user.email nqviet.dev@gmail.com"
                        sh "git config user.name VietNe"
                        sh "git clone https://github.com/VietNe/thesis-cd.git"
                        sh "cd thesis-cd"
                        sh "cat nginx.yaml"
                        //sh "git switch master"
                        // sh "cat deployment.yaml"
                        // sh "sed -i 's+raj80dockerid/test.*+raj80dockerid/test:${DOCKERTAG}+g' deployment.yaml"
                        // sh "cat deployment.yaml"
                        // sh "git add ."
                        // sh "git commit -m 'Done by Jenkins Job changemanifest: ${env.BUILD_NUMBER}'"
                        // sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/${GIT_USERNAME}/kubernetesmanifest.git HEAD:main"
                }
            }

            stage('Cleaning Up') {
                steps{
                  sh "docker rmi --force $registry:v1.$BUILD_NUMBER"
                  sh "docker rmi --force $registry:latest"
                }
            }
        }
    }