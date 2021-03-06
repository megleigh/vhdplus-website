/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

const features = [
  {
    title: <>Unlimited Threads</>,
    imageUrl: 'img/cpu_icon.svg',
    description: (
      <>
        Use Maximum Performance for Every Task
      </>
    ),
  },
  {
    title: <>Built-in libraries</>,
    imageUrl: 'img/extension_icon.svg',
    description: (
      <>
        Add Components and Focus on Creating Your Code.
      </>
    ),
  },
  {
    title: <>Easy to Use</>,
    imageUrl: 'img/programming_icon.svg',
    description: (
      <>
        Benefit from Simple Syntax, a Clean IDE and a Variety of Tutorials
      </>
    ),
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">

            <div className={styles.heroLogo}>
                <img
              alt="VHDPlus Logo"
              src={'img/vhdp.svg'}
              className={styles.heroLogoImage}
            />
            </div>
            
          <div className={styles.PromoSection}>
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
          <Link
              className={classnames(
                'button button--primary',
                styles.getStarted,
              )}
              to={'docs/getstarted#install-vhdp-ide'}
            >
              DOWNLOAD
            </Link>
            <div style={{width: 20}}></div> 
            <Link
              className={classnames(
                'button button--outline getStartedButton',
                styles.getStarted,
              )}
              to={'docs/getstarted'}
            >
              GET STARTED
            </Link>                    
          </div>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container bottomsplit padding-vert--lg">
              <div className="row padding-vert--lg">
                {features.map(({ imageUrl, title, description }, idx) => (
                  <div
                    key={idx}
                    className={classnames('col col--4', styles.feature)}
                  >
                    {imageUrl && (
                      <div className="text--center">
                        <img
                          className={styles.featureImage}
                          src={imageUrl}
                          alt={title}
                        />
                        <h3 style={{padding: "10px"}}>{title}</h3>
                        <p>{description}</p>
                      </div>

                    )}
                    
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        <div className="container bottomsplit padding-vert--lg">
          <div className="row padding-vert--lg">
            <div className="col padding-horiz--lg">
            <div className="vcenter"></div>            
                <img src="/img/About_VHDPlus.jpg" style={{verticalAlign: "middle"}}/>            
            </div>
            <div className="col padding--lg">

                <h2>About VHDPlus</h2>

                FPGAs complete operations at astonishing rates. They are not limited by thread count, because you program the hardware. 
                This leads to incomparable performance, especially in multi-threaded tasks, such as for robots, AI, 
                audio and video processing or Crypto mining.<br></br><br></br>

                This is why FPGAs are already widely used in the professional environment. 
                But due to the high price and difficulty of programming for private users, FPGAs have not yet been established. 
                This is why we started this project.
              </div>
          </div>
        </div>
        <div className="container bottomsplit padding-vert--lg">
          <div className="row padding-vert--lg">           
            <div className="col padding--lg">

                <h2>Our Cutting-Edge Cross Platform IDE</h2>

                VHDPlus IDE creates a simple FPGA programming platform. 
                Features like code suggestions and corrections, automated signal creation, simulation assistant, 
                internal vendor-independent libraries and seamless integration of Quartus, 
                deliver an incomparable FPGA programming experience.<br></br><br></br>
                <h4>Available for Windows and Linux</h4>
                
                <div style={{float: "left", marginRight: 10}}> 
                        <img src="/img/icon-colored-windows.svg" height = "50px"/>
                </div>
                   
                <div style={{marginLeft: 10}}> 
                        <img src="/img/icon-colored-linux.svg" height = "50px" />
                </div>
                <Link
                  className="button button--primary button--lg margin-vert--sm"
                  to={'docs/getstarted#install-vhdp-ide'}
                >
                  Download VHDPlus IDE for free!
                </Link>
            </div>
            <div className="col padding-horiz--lg">
                <div className="vcenter"></div>            
                <img src="/img/VHDPIDE2.png" style={{verticalAlign: "middle"}}/>          
            </div>
          </div>
        </div>
        <div className="container bottomsplit padding-vert--lg">
          <div className="row padding-vert--lg">
            <div className="col padding-horiz--lg">
            <div className="vcenter"></div>            
                <img src="/img/VHDP.png" style={{verticalAlign: "middle"}}/>            
            </div>
            <div className="col padding--lg">

                <h2>VHDP Programming Language</h2>

                By automatically creating state machines, including synthesizable loops, delays, and functions, and due to a much simpler syntax, 
                you can experience up to 95% code reduction at 100% of the performance! <br/><br/>
                VHDP is not a completely different language, but it extends the features of VHDL. So everything you could do with VHDL is also possible with VHDP, and of course, you can still use your old VHDL files.<br/><br/>
                <h4>Download our IDE now and convince yourself!</h4>

                <Link
                className="button button--outline button--lg margin-vert--sm"
                to={'docs/getstarted'}
              >
                Get Started
              </Link>             
              </div>
          </div>
        </div>
        <div className="container bottomsplit padding-vert--lg">
          <div className="row padding-vert--lg">           
            <div className="col padding--lg">

            <h2>Our Hardware</h2>

              Professional-grade hardware designed for inexperienced users and professionals. 
              One board for all your projects, faster than processors, and the perfect companion for the VHDPlus IDE.<br></br><br></br>
              <h4>Quality Made in Germany</h4> <br></br><br></br>

              <Link
                className="button button--outline button--lg margin-vert--sm"
                to={'docs/component_vhdpcore'}
              >
                Find out more
              </Link>
            </div>
            <div className="col padding-horiz--lg">
              <div className="vcenter"></div>            
                <img src="/img/FPGAStarter.png" style={{verticalAlign: "middle"}}/>          
            </div>
          </div>
        </div>
        <div className="container bottomsplit padding-vert--lg">
          <div className="row padding-vert--lg">        
            <div className="col padding--lg">
            <div className="vcenter"></div>            
                <img src="/img/community/US_Connect.png" style={{verticalAlign: "middle"}}/>          
            </div>   
            <div className="col padding-horiz--lg">
                
                <h2>Easy to learn</h2>

                Interested but don't know how to start? Check out our documentation and example projects! 
                Learn how to program your robot and make it yours. Do projects you may not have thought of while working with microcontrollers!<br></br><br></br>

                <div className={styles.buttons}>
                  <Link className="button button--outline button--lg margin-vert--sm" to={'docs/getstarted_vhdp'}>
                    Documentation
                  </Link>
                  <div style={{width: 20}}></div> 
                  <Link className="button button--outline button--lg margin-vert--sm" to={'docs/community_overview'}>
                    Example Projects
                  </Link>
                </div>
            </div>
          </div>
        </div>
        <div className="container padding-vert--lg">
          <div className="row padding-vert--lg">          
            <div className="col padding--lg">

                <h2>Video Tutorials</h2>

                You don't like to read? Then try our video tutorials in that you learn all important features of the IDE.
                From simple blink tutorials to implementing processors and programming them with Arduino - there is something for everybody. <br></br><br></br>

                <Link className="button button--outline button--lg margin-vert--sm" to={'https://www.youtube.com/channel/UC7qiOvlaBSiWyAb7R1xTaEw'}>
                    YouTube Channel
                  </Link>
            </div>
            <div className="col padding-horiz--lg">
                <div className="vcenter"></div>            
                <img src="/img/Youtube.png" style={{verticalAlign: "middle"}}/>          
            </div> 
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Home;
